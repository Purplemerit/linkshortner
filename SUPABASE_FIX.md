# Fix: Can't Reach Supabase Database from Vercel

## Problem
Your logs show:
```
Can't reach database server at `db.zbttccpsaxphhrftzada.supabase.co:5432`
```

This means Vercel **CAN** see your `DATABASE_URL` environment variable, but **CANNOT connect** to your Supabase database.

## Root Cause
Supabase's direct database connection (port 5432) has connection limits and doesn't work well with serverless functions like Vercel. You need to use **Supabase's connection pooler** instead.

## Solution: Use Supabase Connection Pooler

### Step 1: Get Your Connection Pooler URL

1. Go to https://supabase.com/dashboard
2. Select your project: `zbttccpsaxphhrftzada`
3. Click on **Project Settings** (gear icon in bottom left)
4. Click on **Database** in the left sidebar
5. Scroll down to **Connection string**
6. Select **Connection pooling** tab (NOT "Session mode")
7. Click on **Transaction Mode**
8. Copy the connection string - it should look like:

```
postgresql://postgres.zbttccpsaxphhrftzada:Ha@1009200@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Note the differences:**
- Port is `6543` instead of `5432` (connection pooler)
- Host is `aws-0-ap-south-1.pooler.supabase.com` instead of `db.zbttccpsaxphhrftzada.supabase.co`
- Password needs to be URL-encoded: `Ha@1009200` becomes `Ha%401009200`

### Step 2: Update Your Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: `linkshortner-rho`
3. Go to **Settings** → **Environment Variables**
4. Find `DATABASE_URL` and click **Edit**
5. Replace the value with your **connection pooler URL**:

```
postgresql://postgres.zbttccpsaxphhrftzada:Ha%401009200@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**IMPORTANT:**
- Use the exact URL from your Supabase dashboard
- The hostname might be different (could be `us-east-1`, `eu-west-1`, etc.)
- Make sure password `@` is encoded as `%40`
- Use port `6543` (pooler) NOT `5432` (direct)

### Step 3: Update Your Local .env File

Update your local `.env` file with the same connection pooler URL:

```env
DATABASE_URL="postgresql://postgres.zbttccpsaxphhrftzada:Ha%401009200@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
```

This ensures consistency between local and production.

### Step 4: Push Code Changes and Redeploy

I've already removed the file logging that was causing errors. Now push the changes:

```bash
git add .
git commit -m "Remove file logging and fix for Vercel deployment"
git push
```

This will trigger a new deployment on Vercel.

### Step 5: Test

After deployment completes:

1. Visit: `https://linkshortner-rho.vercel.app/api/debug`
   - Should show `DATABASE_URL_EXISTS: true`

2. Visit: `https://linkshortner-rho.vercel.app/api/test`
   - Should show actual user and link counts (not fallback)

3. Try creating a link on your homepage

## Alternative: Use Direct Connection with Connection Limit Fix

If the connection pooler URL doesn't work for some reason, you can try adding connection limit parameters to your direct connection:

```
postgresql://postgres:Ha%401009200@db.zbttccpsaxphhrftzada.supabase.co:5432/postgres?sslmode=require&connection_limit=1&pool_timeout=0
```

But the **connection pooler is the recommended approach** for serverless.

## How to Find Your Exact Connection Pooler URL

Since I don't know your exact Supabase region, here's how to get it:

1. **Supabase Dashboard** → **Project Settings** → **Database**
2. Under "Connection string", switch to **"Connection pooling"** tab
3. Select **"Transaction"** mode (recommended for Prisma)
4. You'll see something like:

```
postgres://postgres.zbttccpsaxphhrftzada:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

5. Replace `[YOUR-PASSWORD]` with `Ha%401009200` (URL-encoded version of `Ha@1009200`)

## Why This Fixes the Issue

- **Direct connection (port 5432)**: Limited connections, times out in serverless
- **Connection pooler (port 6543)**: Designed for serverless, handles many concurrent connections
- Vercel functions are stateless and create new connections frequently
- The pooler manages these connections efficiently

## Verification

After making these changes, your Vercel logs should show:
```
✓ Initializing Prisma Client...
✓ DATABASE_URL configured: YES
✓ User upserted successfully
```

Instead of:
```
✗ Can't reach database server
```

## Still Not Working?

If you still get connection errors after using the pooler:

1. **Check Supabase is Online**: Go to Supabase dashboard and verify your project is active
2. **Verify Password**: Make sure `Ha@1009200` is encoded as `Ha%401009200`
3. **Check Region**: Ensure you're using the correct regional pooler URL from Supabase
4. **Test Locally First**: Run `npm run dev` and test locally before deploying
