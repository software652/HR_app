terraform {
  required_version = ">= 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state — replace bucket/key/region before first apply
  backend "s3" {
    bucket         = "hr-app-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "hr-app-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "hr-app"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# ── VPC ───────────────────────────────────────────────────────────────────────
module "vpc" {
  source = "./modules/vpc"

  name               = "${var.app_name}-${var.environment}"
  cidr               = "10.0.0.0/16"
  availability_zones = ["${var.aws_region}a", "${var.aws_region}b"]
  public_subnets     = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets    = ["10.0.11.0/24", "10.0.12.0/24"]
}

# ── ECR repositories ──────────────────────────────────────────────────────────
module "ecr_api" {
  source = "./modules/ecr"
  name   = "${var.app_name}-api"
}

module "ecr_web" {
  source = "./modules/ecr"
  name   = "${var.app_name}-web"
}

# ── ALB ───────────────────────────────────────────────────────────────────────
module "alb" {
  source = "./modules/alb"

  name            = "${var.app_name}-${var.environment}"
  vpc_id          = module.vpc.vpc_id
  public_subnets  = module.vpc.public_subnet_ids
  certificate_arn = var.acm_certificate_arn
}

# ── ECS cluster + services ────────────────────────────────────────────────────
module "ecs" {
  source = "./modules/ecs"

  app_name        = var.app_name
  environment     = var.environment
  aws_region      = var.aws_region
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  alb_sg_id       = module.alb.security_group_id

  api_image        = "${module.ecr_api.repository_url}:latest"
  web_image        = "${module.ecr_web.repository_url}:latest"
  api_target_group = module.alb.api_target_group_arn
  web_target_group = module.alb.web_target_group_arn

  api_env_vars = {
    NODE_ENV    = "production"
    PORT        = "4000"
    CORS_ORIGIN = "https://${var.domain_name}"
  }

  web_env_vars = {
    NODE_ENV             = "production"
    PORT                 = "3000"
    HOSTNAME             = "0.0.0.0"
    NEXT_PUBLIC_API_URL  = "https://api.${var.domain_name}"
  }
}
