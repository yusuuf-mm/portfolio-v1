variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "S3 bucket name for portfolio assets"
  type        = string
  default     = "yusuufmm-portfolio-assets"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}
