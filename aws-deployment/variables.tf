variable "application" {
  type = string
}

variable "environment" {
  type = string
}

variable "region" {
  type    = string
  default = "us-east-2"
}

variable "cors_origins" {
  type    = string
  default = "*"
}

variable "superusers" {
  type = string
}

variable "cookie_secret" {
  type = string
}

variable "ddb_users_table" {
  type = string
}

variable "ddb_instances_table" {
  type = string
}

variable "cloudfront_aliases" {
  type    = list(string)
  default = []
}

variable "acm_certificate_arn" {
  type = string
}

variable "aws_account" {
  type = string
}
