# PRODUCTION ROADMAP: From Prototype to Real Product

This document outlines the steps to convert the "Frontend + Mock API" prototype into a fully functional, production-ready application.

## Phase 1: Database & Infrastructure (The Backbone)
Currently, data is stored in memory (`dummy-data.ts`) and is lost when the server restarts. We need a persistent database.

### 1.1. Choose & Set up Database
- **Recommendation**: **PostgreSQL** (via Supabase, Neon, or Vercel Postgres).
- **Why**: Relational data (Users -> Links -> Analytics) fits perfectly.
- **Action**:
    - Create a Supabase/Neon project.
    - Get the `DATABASE_URL`.

### 1.2. ORM Setup (Prisma)
- **Tool**: **Prisma** (Industry standard for Next.js).
- **Action**:
    - `npm install prisma --save-dev`
    - `npx prisma init`
    - Define schema in `prisma/schema.prisma`.

**Proposed Schema:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  links     Link[]
  createdAt DateTime @default(now())
}

model Link {
  id          String   @id @default(cuid())
  shortCode   String   @unique
  destination String
  createdAt   DateTime @default(now())
  clicks      Int      @default(0)
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  analytics   Analytics[]
}

model Analytics {
  id        String   @id @default(cuid())
  linkId    String
  link      Link     @relation(fields: [linkId], references: [id])
  timestamp DateTime @default(now())
  country   String?
  device    String?
  referrer  String?
}
```

## Phase 2: Authentication (User Accounts)
Currently, there is no login. We need to know *who* created a link.

### 2.1. Integrate Auth Provider
- **Recommendation**: **Clerk** (Easiest for Next.js) or **NextAuth.js** (Open Source).
- **Action**:
    - Install Clerk SDK.
    - Wrap app in `<ClerkProvider>`.
    - Add Sign In / Sign Up pages.
    - Update database schema to link `Link` records to `User` IDs.

## Phase 3: Core Logic Implementation (The Brains)
Replace the mock API endpoints with real database logic.

### 3.1. Link Creation API (`POST /api/links`)
- **Current**: Pushes to array.
- **New**:
    - Authenticate user.
    - Validate input.
    - `prisma.link.create({ data: { ... } })`.
    - Handle custom code collisions (try/catch unique constraint error).

### 3.2. Redirection Logic (The "Shortener" part)
- **Current**: Missing.
- **New**: Create a dynamic route `src/app/[code]/page.tsx` or `middleware.ts`.
- **Logic**:
    1. Capture `code` from URL (e.g., `short.link/abc123`).
    2. Query DB: `prisma.link.findUnique({ where: { shortCode: code } })`.
    3. If found:
        - **Async**: Trigger analytics logging (increment clicks, save country/device).
        - **Redirect**: `redirect(link.destination)`.
    4. If not found: Show 404 page.

### 3.3. Analytics Dashboard API
- **Current**: Returns static dummy data.
- **New**:
    - Query `Analytics` table using Prisma Aggregations.
    - `prisma.analytics.groupBy({ by: ['country'], _count: true })`.

## Phase 4: Deployment & Custom Domains

### 4.1. Deploy to Vercel
- Connect GitHub repo to Vercel.
- Add `DATABASE_URL` and Auth keys to Environment Variables.

### 4.2. Custom Domains
- **Challenge**: Handling `links.mybrand.com` pointing to your app.
- **Solution**: Vercel Middleware.
    - Detect `hostname` in middleware.
    - If hostname is custom, look up the tenant/user associated with that domain.
    - Rewrite request to the correct link handler.

## Phase 5: Polish & Security

- **Rate Limiting**: Prevent abuse (Upstash Redis).
- **QR Code**: Generate on the fly using the real short URL.
- **Metadata**: Add Open Graph tags for social sharing.

---

## Immediate Next Steps
1. **Install Prisma**: `npm install prisma --save-dev`
2. **Initialize DB**: `npx prisma init`
3. **Define Schema**: Copy the schema above into `prisma/schema.prisma`.
