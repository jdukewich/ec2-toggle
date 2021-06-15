# Generate lambda zip file
cd backend
mkdir tmp
pip install --target tmp -r requirements/production.txt
cd tmp
zip -r9 ../../aws-deployment/payload.zip .
cd ..
zip -r9 ../aws-deployment/payload.zip app main.py
rm -rf tmp

# Build Angular for production
cd ../frontend
# Set Angular environment file from environment variables
sed -i '' "s|apiUrl.*|apiUrl: '$API_URL'|" frontend/src/environments/environment.prod.ts
ng build

# Terraform update
cd ../aws-deployment
terraform apply -var-file="var.tfvars"
