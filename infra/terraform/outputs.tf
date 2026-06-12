output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer — point your domain's CNAME here"
  value       = module.alb.dns_name
}

output "ecr_api_url" {
  description = "ECR repository URL for the API image"
  value       = module.ecr_api.repository_url
}

output "ecr_web_url" {
  description = "ECR repository URL for the Web image"
  value       = module.ecr_web.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name (used in GitHub Actions deploy workflow)"
  value       = module.ecs.cluster_name
}
