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

data "aws_lambda_function_url" "api" {
  function_name = var.lambda_function_name
}

locals {
  backup_bucket_name   = "time-tracker-mongo-backups-${var.account_id}"
  lambda_function_url_host = trimsuffix(replace(data.aws_lambda_function_url.api.function_url, "https://", ""), "/")
}
