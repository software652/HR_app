variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Short application name used as a prefix for all resources"
  type        = string
  default     = "hr-app"
}

variable "environment" {
  description = "Deployment environment (production | staging)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "staging"], var.environment)
    error_message = "environment must be 'production' or 'staging'."
  }
}

variable "domain_name" {
  description = "Root domain name (e.g. yourapp.com). API will be served at api.<domain>."
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN of an ACM certificate covering domain_name and *.domain_name"
  type        = string
}
