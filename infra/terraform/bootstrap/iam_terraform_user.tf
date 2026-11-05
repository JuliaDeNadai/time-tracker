resource "aws_iam_user" "terraform" {
  name = "time-tracker-terraform"
  path = "/"

  tags = {
    Project = "time-tracker"
    Purpose = "terraform-operator-prod"
  }
}

resource "aws_iam_access_key" "terraform" {
  user = aws_iam_user.terraform.name
}

# Managed policy (limit 6144 bytes). Inline user policies cap at 2048 and were too small.
resource "aws_iam_policy" "terraform" {
  name        = "time-tracker-terraform-least-privilege"
  description = "Least privilege for time-tracker Terraform prod stack"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudFrontManage"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateDistribution",
          "cloudfront:UpdateDistribution",
          "cloudfront:DeleteDistribution",
          "cloudfront:GetDistribution",
          "cloudfront:GetDistributionConfig",
          "cloudfront:ListDistributions",
          "cloudfront:TagResource",
          "cloudfront:UntagResource",
          "cloudfront:ListTagsForResource",
          "cloudfront:CreateOriginAccessControl",
          "cloudfront:GetOriginAccessControl",
          "cloudfront:UpdateOriginAccessControl",
          "cloudfront:DeleteOriginAccessControl",
          "cloudfront:ListOriginAccessControls",
          "cloudfront:GetCachePolicy",
          "cloudfront:GetOriginRequestPolicy",
          "cloudfront:ListCachePolicies",
          "cloudfront:ListOriginRequestPolicies"
        ]
        Resource = "*"
      },
      {
        Sid    = "S3BackupBucket"
        Effect = "Allow"
        Action = ["s3:*"]
        Resource = [
          "arn:aws:s3:::time-tracker-mongo-backups-${var.account_id}",
          "arn:aws:s3:::time-tracker-mongo-backups-${var.account_id}/*"
        ]
      },
      {
        Sid    = "IamBackupUserOnly"
        Effect = "Allow"
        Action = [
          "iam:CreateUser",
          "iam:DeleteUser",
          "iam:GetUser",
          "iam:TagUser",
          "iam:ListUserTags",
          "iam:CreateAccessKey",
          "iam:DeleteAccessKey",
          "iam:ListAccessKeys",
          "iam:UpdateAccessKey",
          "iam:PutUserPolicy",
          "iam:GetUserPolicy",
          "iam:DeleteUserPolicy",
          "iam:ListUserPolicies"
        ]
        Resource = [
          "arn:aws:iam::${var.account_id}:user/time-tracker-backup"
        ]
      },
      {
        Sid      = "IamGetAccountPasswordPolicy"
        Effect   = "Allow"
        Action   = ["iam:GetAccountPasswordPolicy"]
        Resource = "*"
      },
      {
        Sid    = "LambdaReadAndPermission"
        Effect = "Allow"
        Action = [
          "lambda:GetFunction",
          "lambda:GetFunctionConfiguration",
          "lambda:GetFunctionUrlConfig",
          "lambda:ListFunctionUrlConfigs",
          "lambda:ListVersionsByFunction",
          "lambda:AddPermission",
          "lambda:RemovePermission",
          "lambda:GetPolicy"
        ]
        Resource = [
          "arn:aws:lambda:*:${var.account_id}:function:${var.lambda_function_name_pattern}"
        ]
      },
      {
        Sid    = "Budgets"
        Effect = "Allow"
        Action = [
          "budgets:ViewBudget",
          "budgets:ModifyBudget",
          "budgets:Describe*",
          "budgets:TagResource",
          "budgets:UntagResource",
          "budgets:ListTagsForResource"
        ]
        Resource = "*"
      },
      {
        Sid    = "SnsBudgetTopic"
        Effect = "Allow"
        Action = [
          "sns:CreateTopic",
          "sns:DeleteTopic",
          "sns:GetTopicAttributes",
          "sns:SetTopicAttributes",
          "sns:ListTagsForResource",
          "sns:TagResource",
          "sns:UntagResource",
          "sns:Subscribe",
          "sns:Unsubscribe",
          "sns:ListSubscriptionsByTopic",
          "sns:GetSubscriptionAttributes"
        ]
        Resource = [
          "arn:aws:sns:*:${var.account_id}:time-tracker-budget-alerts"
        ]
      },
      {
        Sid      = "SnsList"
        Effect   = "Allow"
        Action   = ["sns:ListTopics"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "terraform" {
  user       = aws_iam_user.terraform.name
  policy_arn = aws_iam_policy.terraform.arn
}
