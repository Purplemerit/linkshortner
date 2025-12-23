# Vercel Deployment Guide

## Fixed Issues

The build error `Failed to collect page data for /[code]` has been resolved with the following fixes:

### 1. Dynamic Route Configuration
Added proper exports to `src/app/[code]/route.ts`:
```typescript
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
```

### 2. Middleware Update
Updated `src/middleware.ts` to allow the `[code]` route as a public route:
```typescript
'/:code' // Allow short link redirects without auth
```

### 3. Params Type Fix
Updated params type to match Next.js 14+ async params pattern:
```typescript
{ params }: { params: Promise<{ code: string }> }
```

### 4. Prisma Configuration
Added `postinstall` script to ensure Prisma client is generated during deployment:
```json
"postinstall": "prisma generate"
```

## Vercel Environment Variables

You need to set the following environment variables in your Vercel project settings:

### Required Variables

1. **DATABASE_URL**
   - Your PostgreSQL database connection string
   - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
   - For Vercel, use a service like:
     - Vercel Postgres
     - Neon
     - Supabase
     - Railway
     - PlanetScale (with MySQL adapter)

2. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - Your Clerk publishable key
   - Get from: https://dashboard.clerk.com

3. **CLERK_SECRET_KEY**
   - Your Clerk secret key
   - Get from: https://dashboard.clerk.com

### Setting Environment Variables

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add each variable:
   - **Variable Name**: (e.g., `DATABASE_URL`)
   - **Value**: (your actual value)
   - **Environment**: Select all (Production, Preview, Development)
4. Click "Save"

## Database Setup for Vercel

### Option 1: Vercel Postgres (Recommended)
```bash
# Install Vercel Postgres
vercel postgres create

# This will automatically set DATABASE_URL in your environment
```

### Option 2: External Database (Neon, Supabase, etc.)

1. Create a PostgreSQL database on your preferred provider
2. Get the connection string
3. Add it to Vercel environment variables as `DATABASE_URL`
4. Make sure the database allows connections from Vercel's IP ranges

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel build issues"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - Add all required environment variables (see above)

4. **Deploy**
   - Vercel will automatically deploy
   - Build should now succeed

5. **Run Database Migrations**
   After first deployment, you need to push your Prisma schema:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link your project
   vercel link

   # Run migrations using production database
   npx prisma db push
   ```

## Troubleshooting

### Build Fails with "Failed to collect page data"
- ✅ Fixed: Dynamic route now properly configured

### Database Connection Issues During Build
- The build should succeed without database access
- Database is only needed at runtime
- Ensure `export const dynamic = 'force-dynamic'` is set

### Prisma Client Not Generated
- ✅ Fixed: `postinstall` script ensures Prisma generates client
- If issues persist, add build command override in Vercel:
  - Build Command: `prisma generate && next build`

### Middleware Blocking Routes
- ✅ Fixed: `/:code` route added to public routes
- Short links will now work without authentication

## Testing After Deployment

1. **Test the homepage**: `https://your-app.vercel.app`
2. **Test authentication**: Sign in/Sign up pages
3. **Create a short link**: Use the dashboard
4. **Test redirect**: Visit `https://your-app.vercel.app/[shortcode]`

## Additional Configuration (Optional)

### Custom Domain
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Build & Development Settings
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Support

If you encounter issues:
- Check Vercel deployment logs
- Verify all environment variables are set
- Ensure database is accessible from Vercel
- Check Clerk webhook configuration if using webhooks
