-- Add PROFESSIONAL subscription for testing
-- Email: harshvardhansinghha@gmail.com

-- First, find the user's clerkUserId
-- You need to sign up first at http://localhost:3000/sign-up with this email

-- Then run this SQL in your Supabase SQL editor:

-- Step 1: Find your user ID (replace with the actual Clerk user ID you get after signup)
-- SELECT "clerkUserId", "email", "name" FROM "User" WHERE "email" LIKE '%harshvardhan%';

-- Step 2: Create or update subscription (replace 'user_xxxxx' with your actual clerkUserId)
INSERT INTO "Subscription" (
  id,
  "userId",
  plan,
  status,
  "startDate",
  "endDate",
  amount,
  currency,
  "createdAt"
)
VALUES (
  gen_random_uuid()::text,
  'YOUR_CLERK_USER_ID_HERE', -- Replace this after signing up
  'PROFESSIONAL',
  'ACTIVE',
  NOW(),
  NOW() + INTERVAL '1 year',
  0,
  'INR',
  NOW()
)
ON CONFLICT ("userId") 
DO UPDATE SET
  plan = 'PROFESSIONAL',
  status = 'ACTIVE',
  "endDate" = NOW() + INTERVAL '1 year';
