output "dns_name"             { value = aws_lb.this.dns_name }
output "security_group_id"    { value = aws_security_group.alb.id }
output "api_target_group_arn" { value = aws_lb_target_group.api.arn }
output "web_target_group_arn" { value = aws_lb_target_group.web.arn }
