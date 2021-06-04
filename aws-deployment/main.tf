# Need to add static site hosting for S3, and permissions for lambda role
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = var.region
}

resource "aws_s3_bucket" "bucket" {
  bucket_prefix = "${var.application}-${var.environment}"
  acl           = "private"

  website {
    index_document = "index.html"
  }

  tags = {
    Environment = var.environment
    Application = var.application
  }
}

resource "aws_cloudfront_origin_access_identity" "cf_oag" {
  comment = "${var.application}-${var.environment}"
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.bucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.cf_oag.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "s3_policy" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_s3_bucket_object" "bucket_object" {
  # Add all of the angular build files
  for_each = fileset(path.module, "../frontend/dist/frontend/**")
  key      = replace(each.value, "../frontend/dist/frontend/", "")
  source   = each.value
  bucket   = aws_s3_bucket.bucket.id
  etag     = filemd5(each.value)
}

resource "aws_s3_bucket_object" "html" {
  # Add all of the angular html build files
  for_each     = fileset(path.module, "../frontend/dist/frontend/*.html")
  key          = replace(each.value, "../frontend/dist/frontend/", "")
  source       = each.value
  bucket       = aws_s3_bucket.bucket.id
  content_type = "text/html"
  etag         = filemd5(each.value)
}

resource "aws_cloudfront_distribution" "cloudfront" {
  origin {
    domain_name = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_id   = "S3"

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.cf_oag.id}"
    }
  }

  origin {
    domain_name = replace(aws_apigatewayv2_api.apig.api_endpoint, "https://", "")
    origin_id   = "APIG"

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.1", "TLSv1.2"]
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.application}-${var.environment}"
  default_root_object = "index.html"

  aliases = var.cloudfront_aliases

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "APIG"

    forwarded_values {
      query_string = false
      cookies {
        forward = "whitelist"

        # Maybe change this cookie name in the backend code haha
        whitelisted_names = ["fastapiusersauth"]
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_100"

  tags = {
    Environment = var.environment
    Application = var.application
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }
}

resource "aws_apigatewayv2_api" "apig" {
  name          = "${var.application}-${var.environment}"
  protocol_type = "HTTP"
  target        = aws_lambda_function.lambda.arn

  tags = {
    Environment = var.environment
    Application = var.application
  }
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.apig.execution_arn}/*/*"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.application}-${var.environment}-lambda-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF

  tags = {
    Environment = var.environment
    Application = var.application
  }
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "${var.application}-${var.environment}-lambda-logging-policy"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "${aws_cloudwatch_log_group.log_group.arn}:*",
      "Effect": "Allow"
    }
  ]
}
EOF

  tags = {
    Environment = var.environment
    Application = var.application
  }
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_policy" "lambda_ddb_perm" {
  name        = "${var.application}-${var.environment}-lambda-ddb-policy"
  path        = "/"
  description = "IAM policy for DDB access from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:${var.region}:${var.aws_account}:table/${var.ddb_users_table}",
        "arn:aws:dynamodb:${var.region}:${var.aws_account}:table/${var.ddb_instances_table}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF

  tags = {
    Environment = var.environment
    Application = var.application
  }
}

resource "aws_iam_role_policy_attachment" "lambda_ddb" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_ddb_perm.arn
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "lambda" {
  filename      = "payload.zip"
  function_name = "${var.application}-${var.environment}"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "main.handler"

  source_code_hash = filebase64sha256("payload.zip")

  runtime = "python3.8"

  environment {
    variables = {
      CORS_ORIGINS        = var.cors_origins
      SUPERUSERS          = var.superusers
      COOKIE_SECRET       = var.cookie_secret
      DDB_USERS_TABLE     = var.ddb_users_table
      DDB_INSTANCES_TABLE = var.ddb_instances_table
    }
  }

  tags = {
    Environment = var.environment
    Application = var.application
  }
}

resource "aws_dynamodb_table" "users_ddb_table" {
  name           = var.ddb_users_table
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags = {
    Application = var.application
    Environment = var.environment
  }
}

resource "aws_dynamodb_table" "instances_ddb_table" {
  name           = var.ddb_instances_table
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Application = var.application
    Environment = var.environment
  }
}