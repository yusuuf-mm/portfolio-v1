# Deployment Guide — Phase 6

## Prerequisites

- AWS CLI configured with IAM user `yusuufdevops`
- Terraform >= 1.0 installed locally
- Vercel CLI (optional, for manual deploys)
- Domain: `yusuufmm.is-a.dev`

---

## 1 — Terraform Setup

```bash
cd terraform

# Copy the example vars file and fill in values
cp terraform.tfvars.example terraform.tfvars

# Initialize and plan
terraform init
terraform plan

# Apply (review the plan first)
terraform apply
```

After apply, note the outputs:

- `cloudfront_domain` — your CloudFront CDN URL
- `resume_url` — public link to `resume.pdf` on CloudFront
- `s3_bucket_name` — bucket for uploading assets

---

## 2 — Upload Resume to S3

```bash
# From the project root (where resume.pdf lives)
aws s3 cp resume.pdf s3://yusuufmm-portfolio-assets/resume.pdf \
  --content-type "application/pdf"

# Verify it's accessible via CloudFront
curl -I https://<cloudfront-domain>/resume.pdf
```

---

## 3 — is-a.dev Domain Setup

The `is-a.dev` subdomain points to **Vercel** (not CloudFront). CloudFront is only for static assets like the resume PDF.

1. Fork the [is-a-dev/register](https://github.com/is-a-dev/register) repo
2. Add your domain entry in `domains/yusuufmm.json`:

```json
{
  "owner": { "username": "yusuuf-mm" },
  "record": { "CNAME": "cname.vercel-dns.com" },
  "proxied": false
}
```

3. Open a PR and wait for merge
4. In Vercel dashboard → Settings → Domains → add `yusuufmm.is-a.dev`
5. Vercel will auto-provision SSL

---

## 4 — Vercel Configuration

In your Vercel project settings:

1. **Framework**: Next.js (auto-detected)
2. **Build command**: `npm run build`
3. **Output directory**: `.next` (default)
4. **Environment Variables**: add all vars from Section 5 below

> The `resume.pdf` in the project root is gitignored — it lives on S3/CloudFront, not in the Vercel build.

---

## 5 — Environment Variables Checklist

| Variable                   | Value                                    | Where  |
| -------------------------- | ---------------------------------------- | ------ |
| `RESEND_API_KEY`           | from Resend dashboard                    | Vercel |
| `UPSTASH_REDIS_REST_URL`   | from Upstash dashboard                   | Vercel |
| `UPSTASH_REDIS_REST_TOKEN` | from Upstash dashboard                   | Vercel |
| `NEXT_PUBLIC_RESUME_URL`   | `https://<cloudfront-domain>/resume.pdf` | Vercel |
| `NEXT_PUBLIC_SITE_URL`     | `https://yusuufmm.is-a.dev`              | Vercel |

> **Never commit `.env.local` or `terraform.tfvars`** — both are gitignored.

---

## Teardown

```bash
cd terraform
terraform destroy
```

This removes the S3 bucket and CloudFront distribution.
