# PeopleHR — HR Management Platform

A full-stack HR management application built with **Next.js 15** (App Router) and **Express + TypeScript**.

## Architecture

```
HR_app/
├── apps/
│   ├── api/          Express API (port 4000)
│   │   ├── src/
│   │   │   ├── app.ts              Express app factory (testable)
│   │   │   ├── server.ts           Entry point (binds port)
│   │   │   ├── data.ts             In-memory data store
│   │   │   ├── types/              Shared TypeScript interfaces
│   │   │   ├── middleware/         auth, request logger
│   │   │   └── routes/             auth, employees, leaves, payroll, jobs
│   │   └── src/__tests__/          Vitest + Supertest integration tests
│   └── web/          Next.js frontend (port 3000)
│       ├── app/                    App Router pages
│       ├── components/             StatusBadge, ErrorMessage, ErrorBoundary
│       ├── lib/                    api helper, shared types
│       └── __tests__/              Vitest + Testing Library unit tests
├── infra/terraform/  AWS ECS infrastructure (modular)
├── .github/workflows/
│   ├── ci.yml        Typecheck + test on every push
│   └── deploy.yml    Build → ECR → ECS deploy on main
├── docker-compose.yml       Local development
└── docker-compose.prod.yml  Production containers
```

## Modules

| Module      | Status | Data source |
|-------------|--------|-------------|
| Dashboard   | ✅ Live | `/dashboard` |
| Employees   | ✅ Live | `/employees` |
| Leave       | ✅ Live | `/leaves` |
| Payroll     | ✅ Live | `/payroll` |
| Recruitment | ✅ Live | `/jobs` |
| Reports     | ✅ Live | `/dashboard` |
| Attendance  | 🔲 Stub | — |
| Performance | 🔲 Stub | — |
| Settings    | ✅ Live | env vars |

## Local development

### Prerequisites
- Node.js 22+
- npm 9+

### Setup

```bash
git clone https://github.com/software652/HR_app.git
cd HR_app
npm install
```

Run API and web in separate terminals:

```bash
# Terminal 1
npm run dev:api      # http://localhost:4000

# Terminal 2
npm run dev:web      # http://localhost:3000
```

Demo credentials: `hr@company.com` / `password123`

### With Docker Compose

```bash
docker compose up
```

Frontend: http://localhost:3000 · API: http://localhost:4000

## API reference

All routes except `/health` and `POST /auth/login` require:
```
Authorization: Bearer <token>
```

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (public) |
| POST | `/auth/login` | Authenticate, returns token |
| GET | `/dashboard` | Aggregate stats |
| GET/POST | `/employees` | List / create employees |
| GET/PATCH/DELETE | `/employees/:id` | Get / update / delete |
| GET/POST | `/leaves` | List / create leave requests |
| PATCH | `/leaves/:id/status` | Approve or reject |
| GET/POST | `/payroll` | List / create payroll records |
| PATCH | `/payroll/:id/status` | Update status |
| GET/POST | `/jobs` | List / create job listings |
| PATCH | `/jobs/:id` | Update job |

## Testing

```bash
# API — 28 integration tests
npm test -w apps/api

# Web — 17 unit tests
npm test -w apps/web
```

## Production deployment (AWS ECS)

### Required GitHub secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_ACCOUNT_ID` | 12-digit AWS account ID |
| `NEXT_PUBLIC_API_URL` | Public API URL baked into the web image |

### Required GitHub variables

| Variable | Example |
|----------|---------|
| `AWS_REGION` | `us-east-1` |
| `NEXT_PUBLIC_API_URL` | `https://api.yourapp.com` |

### Provision infrastructure

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your domain and ACM certificate ARN

terraform init
terraform plan
terraform apply
```

Terraform creates:
- VPC with public/private subnets across 2 AZs
- NAT Gateways for private subnet egress
- ECR repositories for API and Web images
- Application Load Balancer with HTTPS and HTTP→HTTPS redirect
- ECS Fargate cluster with API and Web services (2 tasks each)
- Auto-scaling policies (target 70% CPU, max 6 tasks)
- CloudWatch log groups (30-day retention)

### Deploy

Push to `main` — the `deploy.yml` workflow:
1. Runs CI (typecheck + tests)
2. Builds and pushes Docker images to ECR
3. Updates ECS task definitions
4. Deploys API, then Web, with automatic rollback on failure

### Manual deploy

```bash
# Build and push images
docker build -f apps/api/Dockerfile -t <ECR_URL>/hr-api:latest .
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.yourapp.com \
  -t <ECR_URL>/hr-web:latest .

aws ecr get-login-password | docker login --username AWS --password-stdin <ECR_URL>
docker push <ECR_URL>/hr-api:latest
docker push <ECR_URL>/hr-web:latest

# Force new deployment
aws ecs update-service --cluster hr-cluster --service hr-api-service --force-new-deployment
aws ecs update-service --cluster hr-cluster --service hr-web-service --force-new-deployment
```

## Environment variables

### API

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Listen port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `NODE_ENV` | `development` | Node environment |

### Web

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | API base URL (baked in at build time) |
| `PORT` | `3000` | Listen port |

## Security notes

- All data endpoints require a Bearer token — unauthenticated requests receive `401`
- CORS is restricted to the configured `CORS_ORIGIN`
- ECS tasks run in private subnets; only the ALB is internet-facing
- ALB enforces TLS 1.3 minimum (`ELBSecurityPolicy-TLS13-1-2-2021-06`)
- ECR image scanning is enabled on push
- ALB access logs are retained for 30 days
- **Production**: replace the demo token with JWT signed by a secret stored in AWS Secrets Manager
