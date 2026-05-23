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

variable "ses_from_email" {
  description = "SES verified sender email address"
  type        = string
  default     = "yusuufmmdevs@gmail.com"
}

variable "ses_to_email" {
  description = "Destination email for contact form submissions"
  type        = string
  default     = "yusuf2000mm@gmail.com"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}
