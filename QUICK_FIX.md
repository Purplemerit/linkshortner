# QUICK FIX: Database Unavailable Error

## The Real Problem
Your `DATABASE_URL` **IS** set in Vercel, but you're using the **wrong connection type** for serverless.

The error `Can't reach database server at db.zbttccpsaxphhrftzada.supabase.co:5432` means you're using the direct connection (port 5432) which doesn't work well with Vercel's serverless functions.

## The Solution (2 Steps)

### 1. Get Supabase Connection Pooler URL

Go to: https://supabase.com/dashboard
- Click your project
- **Settings** → **Database**
- Under "Connection string", click **"Connection pooling"** tab
- Select **"Transaction"** mode
- Copy the URL (should have port `6543` and `pooler.supabase.com`)

Example:
```
postgresql://postgres.zbttccpsaxphhrftzada:Ha%401009200@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### 2. Update DATABASE_URL in Vercel

Go to: https://vercel.com/dashboard
- Click your project `linkshortner-rho`
- **Settings** → **Environment Variables**
- Edit `DATABASE_URL`
- Paste the connection pooler URL from step 1
- Save
- Redeploy

## Deploy Your Code Changes

I've fixed the file logging errors. Push the changes:

```bash
git add .
git commit -m "Fix database connection for Vercel"
git push
```

## That's It!

After redeployment, your site should work. The connection pooler is designed for serverless and will handle Vercel's connection pattern correctly.

## Test URLs

After deployment:
- https://linkshortner-rho.vercel.app/api/debug (check env vars)
- https://linkshortner-rho.vercel.app/api/test (test database)
- https://linkshortner-rho.vercel.app/ (try creating a link)

For detailed explanation, see [SUPABASE_FIX.md](SUPABASE_FIX.md)
