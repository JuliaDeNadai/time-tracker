variable "aws_region" {
  type        = string
  description = "AWS region of the existing Lambda"
  default     = "us-east-1"
}

variable "account_id" {
  type        = string
  description = "AWS account ID"
  default     = "556479867163"
}

variable "lambda_function_name" {
  type        = string
  description = "Existing Serverless Lambda name (ex: time-tracker-api-prod-api)"
}

variable "budget_limit_usd" {
  type        = string
  description = "Monthly AWS Budgets alert threshold in USD"
  default     = "1"
}

variable "budget_email" {
  type        = string
  description = "Email that receives budget alerts (confirm SNS subscription after apply)"
}
