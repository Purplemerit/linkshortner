# Troubleshooting 503 Database Unavailable Error

## Current Issue
You're getting a 503 Service Unavailable error on `https://linkshortner-rho.vercel.app/api/links`

## Step-by-Step Fix

### Step 1: Verify Which Vercel Project You're Using

You have TWO different URLs mentioned:
- `linkshortner-wgia.vercel.app` (mentioned in first error)
- `linkshortner-rho.vercel.app` (current deployment showing in browser)

**Action Required:**
1. Go to https://vercel.com/dashboard
2. Find which project is `linkshortner-rho` (this is the one you're actually using)
3. Make sure you're adding environment variables to the CORRECT project

### Step 2: Add Environment Variables to Vercel

Go to your Vercel project settings:
1. Click on your project: `linkshortner-rho`
2. Click **Settings** tab
3. Click **Environment Variables** in left sidebar
4. Add these THREE variables (click "Add" for each one):

**Variable 1:**
- Key: `DATABASE_URL`
- Value: `postgresql://postgres:Ha%401009200@db.zbttccpsaxphhrftzada.supabase.co:5432/postgres?sslmode=require`
- Environments: Check ALL three boxes (Production, Preview, Development)

**Variable 2:**
- Key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Value: `pk_test_YW1hemluZy1mb3hob3VuZC01Ni5jbGVyay5hY2NvdW50cy5kZXYk`
- Environments: Check ALL three boxes

**Variable 3:**
- Key: `CLERK_SECRET_KEY`
- Value: `sk_test_R3GFSlhUgE3DogLzcsnnf4NdPuFwr7qGowrqUi89Z6`
- Environments: Check ALL three boxes

**IMPORTANT:** Do NOT wrap values in quotes. Paste them exactly as shown above.

### Step 3: Redeploy

After adding ALL environment variables:

**Option A: Trigger redeploy via Git**
```bash
git add .
git commit -m "Fix database configuration for production"
git push
```

**Option B: Manual redeploy in Vercel**
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the "..." (three dots) button
4. Click "Redeploy"
5. Confirm redeploy

### Step 4: Test the Deployment

Once redeployed, test these endpoints:

**Test 1: Debug endpoint (NEW)**
Visit: `https://linkshortner-rho.vercel.app/api/debug`

This will show you if environment variables are set. You should see:
```json
{
  "status": "Environment check",
  "DATABASE_URL_EXISTS": true,
  "CLERK_KEY_EXISTS": true,
  ...
}
```

If `DATABASE_URL_EXISTS` is `false`, the environment variable wasn't added correctly.

**Test 2: Original test endpoint**
Visit: `https://linkshortner-rho.vercel.app/api/test`

**Test 3: Try creating a link**
Visit your homepage and try to create a short link.

### Step 5: Check Vercel Logs

If still getting errors:

1. Go to your Vercel project dashboard
2. Click **Deployments**
3. Click on the latest deployment
4. Click **Functions** tab
5. Click on any failed function (like `/api/links`)
6. Look for error messages in the logs

Common error messages and what they mean:

- `"DATABASE_URL is not configured"` → Environment variable not set in Vercel
- `"Can't reach database server"` → Database connection issue (check Supabase)
- `"PrismaClientInitializationError"` → Prisma can't connect (usually means wrong DATABASE_URL)
- `"connect ETIMEDOUT"` → Network timeout (Supabase might be blocking Vercel IPs)

## Common Mistakes

### ❌ WRONG: Wrapping in quotes
```
DATABASE_URL="postgresql://..."
```

### ✅ CORRECT: No quotes
```
DATABASE_URL=postgresql://...
```

### ❌ WRONG: Adding to wrong project
Make sure you're in `linkshortner-rho`, not `linkshortner-wgia`

### ❌ WRONG: Not redeploying after adding variables
Environment variables only take effect after a new deployment

### ❌ WRONG: Forgetting to check all environment boxes
You need to select Production, Preview, AND Development

## Supabase Connection Issues

If environment variables are set correctly but you still can't connect:

### Check 1: Verify Supabase is Online
1. Go to https://supabase.com/dashboard
2. Check if your project `zbttccpsaxphhrftzada` is active
3. Go to **Settings** → **Database**
4. Verify the connection string matches

### Check 2: Check Connection Pooling
For serverless functions (Vercel), you might need to use Supabase's connection pooling:

Instead of:
```
postgresql://postgres:Ha%401009200@db.zbttccpsaxphhrftzada.supabase.co:5432/postgres
```

Try the pooler URL:
```
postgresql://postgres:Ha%401009200@db.zbttccpsaxphhrftzada.supabase.co:6543/postgres
```

Note the port change from `5432` to `6543`.

### Check 3: Verify Password Special Characters
Your password `Ha@1009200` is encoded as `Ha%401009200`

Test that it's correct:
```bash
# In your terminal
psql "postgresql://postgres:Ha%401009200@db.zbttccpsaxphhrftzada.supabase.co:5432/postgres?sslmode=require"
```

## Still Not Working?

After following all steps, if you're still getting 503 errors:

1. **Share the output from `/api/debug`** - This will tell us what's actually set
2. **Share Vercel function logs** - Go to Deployments → Functions → Copy the error logs
3. **Verify Supabase connection** - Test the connection string locally first

## Quick Test Locally

Test if the connection string works on your machine:

```bash
npm run dev
```

Visit `http://localhost:3000` and try creating a link. If it works locally but not on Vercel, it's definitely an environment variable issue.
