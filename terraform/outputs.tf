output "cloudfront_domain" {
  description = "CloudFront distribution domain name"
  value       = "https://${aws_cloudfront_distribution.portfolio.domain_name}"
}

output "resume_url" {
  description = "Public URL for the resume PDF"
  value       = "https://${aws_cloudfront_distribution.portfolio.domain_name}/resume.pdf"
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.portfolio.bucket
}


