# Bootstrap — usuário `time-tracker-terraform`

Cria **somente** o IAM user operador do Terraform (least-privilege). Rode **uma vez** com credencial admin da conta `556479867163`.

## O que já existe (não cria)

- Lambda API, Function URL, role `role-for-time-tracker`, bucket `time-tracker-code-bucket`, Atlas M0

## O que este stack cria

| Recurso | Nome | Custo |
| --- | --- | --- |
| IAM user + access key | `time-tracker-terraform` | US$ 0 |
| Inline policy | least-privilege (CloudFront, S3 backup, IAM backup user, Lambda permissions, Budgets, SNS) | US$ 0 |

## Como aplicar

```bash
cd infra/terraform/bootstrap
terraform init
terraform plan
terraform apply
```

Guardar as keys (password manager). **Não** commitiar.

```bash
terraform output terraform_access_key_id
terraform output -raw terraform_secret_access_key
```

Depois use essas keys em `infra/terraform/prod/`.
