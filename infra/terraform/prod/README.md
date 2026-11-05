# Terraform prod — time-tracker

Infra nova de produção (backup + CloudFront + budget). A Lambda continua sendo deployada pelo Serverless / GitHub Actions.

## Inventário

### Já existe (não recriar)

| Recurso | Nome |
| --- | --- |
| Lambda + Function URL | `time-tracker-api-prod-api` (confirmar no console) |
| Role | `role-for-time-tracker` |
| Bucket de código Serverless | `time-tracker-code-bucket` |
| MongoDB | Atlas M0 |
| CD | push em `main` → `sls deploy` |

### Este stack cria

| Recurso | Custo |
| --- | --- |
| S3 `time-tracker-mongo-backups-<account>` (lifecycle 90d) | centavos |
| IAM `time-tracker-backup` | US$ 0 |
| CloudFront + OAC | plano **Free** (associar no console) |
| Lambda permissions para CloudFront | US$ 0 |
| Budgets US$ 1 + SNS e-mail | US$ 0 |

## Pré-requisito

1. Aplicar `../bootstrap` com admin e exportar as keys do `time-tracker-terraform`.
2. Confirmar o nome da Lambda: `aws lambda list-functions --query "Functions[?contains(FunctionName,'time-tracker')].FunctionName"`

## Apply

```bash
export AWS_ACCESS_KEY_ID=...          # time-tracker-terraform
export AWS_SECRET_ACCESS_KEY=...
cp terraform.tfvars.example terraform.tfvars
# editar lambda_function_name e budget_email
terraform init
terraform plan
terraform apply
```

## Depois do apply (obrigatório para custo zero)

1. Confirmar o e-mail da inscrição SNS (link no inbox).
2. Console CloudFront → distribution (`cloudfront_distribution_id`) → associar **Free pricing plan** + rate limit WAF (ex.: 300 req / 5 min / IP). **Não** aceitar upgrade pago.
3. GitHub secrets:
   - `BACKUP_AWS_ACCESS_KEY` = `terraform output -raw backup_access_key_id`
   - `BACKUP_AWS_SECRET_ACCESS_KEY` = `terraform output -raw backup_secret_access_key`
   - `LAMBDA_URL` = `terraform output -raw cloudfront_url`
4. Rodar workflow `Backup Mongo` (manual) e conferir o objeto no S3.

## Controles de custo

- Budgets: alerta em 80% previsto e 100% atual do limite (default US$ 1)
- S3: expire 90 dias
- Lambda (via `serverless.yml`): `logRetentionInDays: 14`, `reservedConcurrency: 5`
- Sem VPC/NAT, sem API Gateway cobrado
