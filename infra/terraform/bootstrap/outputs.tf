output "terraform_user_name" {
  description = "IAM user for terraform apply of prod stack"
  value       = aws_iam_user.terraform.name
}

output "terraform_access_key_id" {
  description = "Access key ID for time-tracker-terraform"
  value       = aws_iam_access_key.terraform.id
}

output "terraform_secret_access_key" {
  description = "Secret access key for time-tracker-terraform (store securely, never commit)"
  value       = aws_iam_access_key.terraform.secret
  sensitive   = true
}
