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
- `ses_identity_arn` — SES email identity

---

## 2 — SES Email Verification

After `terraform apply`, AWS sends a verification email to `yusuufmmdevs@gmail.com`.

1. Check the inbox for **"Amazon Web Services – Email Address Verification Request"**
2. Click the verification link
3. Confirm in the AWS SES console that the identity status is **Verified**

> Until verified, SES is in sandbox mode — it can only send to verified addresses.

---

## 3 — Upload Resume to S3

```bash
# From the project root (where resume.pdf lives)
aws s3 cp resume.pdf s3://yusuufmm-portfolio-assets/resume.pdf \
  --content-type "application/pdf"

# Verify it's accessible via CloudFront
curl -I https://<cloudfront-domain>/resume.pdf
```

---

## 4 — is-a.dev Domain Setup

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

## 5 — Vercel Configuration

In your Vercel project settings:

1. **Framework**: Next.js (auto-detected)
2. **Build command**: `npm run build`
3. **Output directory**: `.next` (default)
4. **Environment Variables**: add all vars from Section 6 below

> The `resume.pdf` in the project root is gitignored — it lives on S3/CloudFront, not in the Vercel build.

---

## 6 — Environment Variables Checklist

| Variable                   | Value                                    | Where  |
| -------------------------- | ---------------------------------------- | ------ |
| `AWS_REGION`               | `us-east-1`                              | Vercel |
| `AWS_ACCESS_KEY_ID`        | from IAM                                 | Vercel |
| `AWS_SECRET_ACCESS_KEY`    | from IAM                                 | Vercel |
| `SES_FROM_EMAIL`           | `yusuufmmdevs@gmail.com`                 | Vercel |
| `SES_TO_EMAIL`             | `yusuf2000mm@gmail.com`                  | Vercel |
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

This removes the S3 bucket, CloudFront distribution, and SES identity.
