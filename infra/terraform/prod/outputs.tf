output "cloudfront_domain" {
  description = "CloudFront domain — set GitHub secret LAMBDA_URL to https://<this>"
  value       = aws_cloudfront_distribution.api.domain_name
}

output "cloudfront_url" {
  description = "Full HTTPS URL for the API via CloudFront"
  value       = "https://${aws_cloudfront_distribution.api.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "Use in console to associate CloudFront Free pricing plan + WAF rate limit"
  value       = aws_cloudfront_distribution.api.id
}

output "backup_bucket_name" {
  description = "S3 bucket for weekly mongodump archives"
  value       = aws_s3_bucket.mongo_backups.bucket
}

output "backup_access_key_id" {
  description = "GitHub secret BACKUP_AWS_ACCESS_KEY"
  value       = aws_iam_access_key.backup.id
}

output "backup_secret_access_key" {
  description = "GitHub secret BACKUP_AWS_SECRET_ACCESS_KEY"
  value       = aws_iam_access_key.backup.secret
  sensitive   = true
}

output "lambda_function_url_host" {
  description = "Existing Function URL host used as CloudFront origin"
  value       = local.lambda_function_url_host
}
