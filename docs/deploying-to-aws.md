# Deploying to AWS

The app is a folder of static files (`dist/` after `npm run build`), so it needs no servers or databases on AWS. The recommended setup is a private S3 bucket served through CloudFront.

## Recommended setup

| Component | Choice | Why |
|---|---|---|
| Storage | S3 bucket in **Asia Pacific (New Zealand), `ap-southeast-6`**, with public access blocked | Keeps the files in New Zealand |
| Delivery | CloudFront distribution with Origin Access Control to the bucket | HTTPS, caching, security headers |
| Domain | A `.govt.nz` or agency subdomain, with a certificate from AWS Certificate Manager (in `us-east-1`, which CloudFront requires) | Users can trust it's genuine |
| Security headers | CloudFront response headers policy | See below |
| Deployment | GitHub Actions using OpenID Connect (OIDC) to assume an AWS role | No long-lived AWS keys stored in GitHub |

CloudFront serves copies from edge locations worldwide. The app holds no personal information, so this is normally acceptable, but record it in your cloud risk assessment.

## Security headers

Add a CloudFront response headers policy with:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Check the result with the MDN HTTP Observatory.

## Deployment workflow

Replace (or add alongside) `deploy.yml` with a workflow that builds, then syncs to S3 and invalidates the CloudFront cache:

```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]
permissions:
  contents: read
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci && npm run check && npx vite build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ap-southeast-6
      - run: aws s3 sync dist/ s3://${{ vars.S3_BUCKET }}/ --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ vars.CLOUDFRONT_ID }} --paths "/*"
```

Store the role ARN, bucket name and distribution ID as repository **variables** (they aren't secrets). The IAM role should only allow `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the bucket and `cloudfront:CreateInvalidation` on the distribution, and trust only this repository's `main` branch.

## Before go-live

- Security risk assessment and certification and accreditation under the NZISM, proportionate to a static site with no personal information
- Privacy impact assessment (brief, as no personal information is collected)
- GCDO public cloud risk assessment for the AWS services used
- Infrastructure defined as code (Terraform/OpenTofu or AWS CDK) in an `infra/` folder, so environments can be reviewed and rebuilt
