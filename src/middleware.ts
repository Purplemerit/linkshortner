import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/verify-email',
  '/api/webhooks(.*)',
  '/:code'
]);

// Define protected dashboard routes - must be authenticated to access
const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
  '/dev-tools(.*)',
  '/protected(.*)',
]);

// Define API routes that handle their own verification
const isApiRoute = createRouteMatcher([
  '/api/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // If route is protected and user is not authenticated, redirect to sign-in
  if (protectedRoutes(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // For all authenticated users, we rely on webhooks or API routes to sync DB
  // We cannot use Prisma in middleware (Edge Runtime)

  if (userId) {
    // Optional: Check Clerk metadata for onboarding status if available
    // const onboardingComplete = sessionClaims?.metadata?.onboardingComplete; 
    // if (isDashboardRoute && !onboardingComplete) ...
  }

  // For authenticated users on protected routes, check email verification
  if (userId && protectedRoutes(req) && !isApiRoute(req)) {
    let emailVerified = sessionClaims?.email_verified as boolean | undefined;

    if (!emailVerified) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const hasOAuthAccount = user?.externalAccounts && user.externalAccounts.length > 0;

        if (hasOAuthAccount) {
          emailVerified = true;
        }
      } catch (e) {
        // Continue with claims check if fetch fails
      }
    }

    // Set header for unverified email banner
    if (!emailVerified) {
      const response = NextResponse.next();
      response.headers.set('x-email-unverified', 'true');
      return response;
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
