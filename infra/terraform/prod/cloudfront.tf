# OAC only works when Function URL auth is AWS_IAM.
# While serverless.yml still has url: true (NONE), CloudFront must call the URL as a normal HTTPS origin.
# Re-attach origin_access_control_id when switching Function URL to aws_iam (final rollout step).
resource "aws_cloudfront_origin_access_control" "api" {
  name                              = "time-tracker-api-oac"
  description                       = "OAC for time-tracker Lambda Function URL (attach after aws_iam)"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "api" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "time-tracker API (prod) — associate Free pricing plan in console"
  default_root_object = ""
  price_class         = "PriceClass_100"

  origin {
    domain_name = local.lambda_function_url_host
    origin_id   = "time-tracker-lambda-url"
    # origin_access_control_id = aws_cloudfront_origin_access_control.api.id  # enable with aws_iam

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "time-tracker-lambda-url"

    # AWS managed: CachingDisabled
    cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    # AWS managed: AllViewerExceptHostHeader
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac"

    viewer_protocol_policy = "https-only"
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Project = "time-tracker"
    Stage   = "prod"
  }

  # Free pricing plan (console) attaches a Web ACL and may change price_class.
  # Do not let Terraform strip the Web ACL — AWS rejects that while the plan is subscribed.
  lifecycle {
    ignore_changes = [
      web_acl_id,
      price_class,
    ]
  }
}
