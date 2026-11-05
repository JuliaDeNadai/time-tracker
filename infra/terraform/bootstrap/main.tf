terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type        = string
  description = "AWS region (use the same region as the Lambda)"
  default     = "us-east-1"
}

variable "account_id" {
  type        = string
  description = "AWS account ID"
  default     = "556479867163"
}

variable "lambda_function_name_pattern" {
  type        = string
  description = "Lambda name pattern this operator may touch"
  default     = "time-tracker-api-*"
}
