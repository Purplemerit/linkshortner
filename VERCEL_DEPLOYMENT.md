# Vercel Deployment Guide

## Issue: Database Unavailable in Production

Your app is returning 503 errors because the `DATABASE_URL` environment variable is not properly configured in Vercel.

## Solution: Configure Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Select your project: `linkshortner-wgia`
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add Environment Variables

Add the following environment variables:

#### 1. DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://postgres:Ha%401009200@db.zbttccpsaxphhrftzada.supabase.co:5432/postgres?sslmode=require`
- **Environment**: Select all (Production, Preview, Development)

#### 2. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- **Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Value**: `pk_test_YW1hemluZy1mb3hob3VuZC01Ni5jbGVyay5hY2NvdW50cy5kZXYk`
- **Environment**: Select all (Production, Preview, Development)

#### 3. CLERK_SECRET_KEY
- **Key**: `CLERK_SECRET_KEY`
- **Value**: `sk_test_R3GFSlhUgE3DogLzcsnnf4NdPuFwr7qGowrqUi89Z6`
- **Environment**: Select all (Production, Preview, Development)

### Step 3: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **...** (three dots) menu
4. Click **Redeploy**

OR simply push a new commit to trigger automatic redeployment.

### Step 4: Verify

After redeployment:
1. Visit your site: https://linkshortner-wgia.vercel.app
2. Check the browser console for errors
3. Try creating a short link

## How the Dynamic Base URL Works

The app already handles dynamic base URLs correctly using the `getRequestOrigin()` function in [src/app/api/links/route.ts](src/app/api/links/route.ts:11-19):

```typescript
function getRequestOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (forwardedHost) {
    const proto = forwardedProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : 'https');
    return `${proto}://${forwardedHost.replace(/\/$/, '')}`;
  }
  return request.nextUrl?.origin || '';
}
```

This function automatically:
- Detects if running on Vercel (uses forwarded headers)
- Constructs the correct base URL based on the current domain
- Works in both local development and production

## Common Issues

### Issue: Still getting 503 errors after adding environment variables
**Solution**: Make sure you redeployed after adding the variables. Environment variables only take effect after a new deployment.

### Issue: DATABASE_URL contains special characters
**Solution**: URL encode special characters in the password. For example:
- `@` becomes `%40`
- `!` becomes `%21`
- Your password `Ha@1009200` is correctly encoded as `Ha%401009200`

### Issue: Database connection timeout
**Solution**:
1. Check if your Supabase database allows connections from Vercel IPs
2. Verify the `sslmode=require` parameter is included
3. Test the connection string locally first

## Checking Logs

To see detailed error logs in Vercel:
1. Go to your project dashboard
2. Click **Deployments**
3. Click on a deployment
4. Click **Functions** tab to see serverless function logs
5. Look for Prisma or database connection errors

## Local Development

For local development, make sure your `.env` file exists with the same variables. The `.env.example` file is provided as a template.
