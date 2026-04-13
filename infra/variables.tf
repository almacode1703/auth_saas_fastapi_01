variable "project_name" {
  description = "Name of the project"
  default     = "instashark"
}

variable "aws_region" {
  description = "AWS region"
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment"
  default     = "production"
}

variable "db_password" {
  description = "Password for the RDS PostgreSQL database"
  type        = string
  sensitive   = true
}