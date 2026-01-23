# ReachInbox - Email Campaign Scheduler

A full-stack email scheduling and campaign management application built with React, Express, PostgreSQL, Redis, and BullMQ.

## 🚀 Features

### Backend
- ✅ **Email Scheduling** - Schedule emails to be sent at specific times
- ✅ **Persistence** - All scheduled emails survive server restarts (stored in PostgreSQL)
- ✅ **Rate Limiting** - Global and per-sender hourly email limits
- ✅ **Concurrency Control** - Process multiple emails simultaneously with worker pools
- ✅ **Retry Logic** - Automatic exponential backoff retry for failed emails
- ✅ **Dead Letter Queue** - Failed emails after max retries are moved to a dead queue
- ✅ **Idempotency** - Prevent duplicate email scheduling
- ✅ **User Authentication** - Firebase Admin SDK for secure user authentication
- ✅ **Multi-tenant** - Each user sees only their own emails

### Frontend
- ✅ **Google OAuth Login** - Secure authentication via Firebase
- ✅ **Dashboard** - View scheduled and sent emails
- ✅ **Email Composer** - Schedule emails with rich form validation
- ✅ **Real-time Updates** - View email status (scheduled, sending, sent, failed)
- ✅ **Responsive UI** - Built with Tailwind CSS
- ✅ **Protected Routes** - Authenticated access only

## 🏗️ Architecture Overview

### Email Scheduling Flow

```
1. User schedules email via frontend
   ↓
2. API validates request & creates Email record in PostgreSQL
   ↓
3. Job added to BullMQ queue with calculated delay
   ↓
4. Redis stores job data persistently
   ↓
5. Worker processes job at scheduled time
   ↓
6. Email sent via SMTP (Ethereal)
   ↓
7. Database updated with sent status
```

### Persistence on Restart

**How it works:**
- All scheduled emails are stored in **PostgreSQL** with `scheduledAt` timestamp
- BullMQ jobs are stored in **Redis** with persistence enabled
- When server restarts:
  1. Worker reconnects to Redis
  2. Delayed jobs automatically resume from Redis
  3. If a job was lost, the database record ensures it can be rescheduled
  4. Failed jobs are retried with exponential backoff

### Rate Limiting Implementation

**Two-tier rate limiting:**

1. **Global Limit**: `MAX_EMAILS_PER_HOUR_GLOBAL` (default: 500/hour)
   - Tracked in Redis with key: `email_global:{hour}`
   - Prevents server overload

2. **Per-Sender Limit**: `MAX_EMAILS_PER_HOUR_PER_SENDER` (default: 50/hour)
   - Tracked in Redis with key: `email_sender:{senderId}:{hour}`
   - Prevents individual sender abuse

**Implementation:**
```typescript
// Redis counter incremented on each send attempt
const count = await redis.incr(`email_global:${hour}`);
if (count === 1) await redis.expire(key, 3600); // Auto-expire after 1 hour
return count <= maxLimit;
```

### Concurrency Control

**Worker Configuration:**
```typescript
const emailWorker = new Worker('email-queue', processorFunction, {
  connection: redisConnection,
  concurrency: 3 // Process 3 emails simultaneously
});
```

**Benefits:**
- Processes multiple emails in parallel
- Configurable based on server capacity
- Each job respects `MIN_DELAY_MS` throttling

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis instance
- Firebase project (for authentication)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ReachInBox
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd Backend
npm install
```

#### Environment Variables

Create `Backend/.env`:

```env
PORT=4000

# PostgreSQL Database (e.g., Neon, Supabase, local)
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis (e.g., Upstash, local)
REDIS_URL=redis://localhost:6379

# Rate Limiting
MAX_EMAILS_PER_HOUR_GLOBAL=500
MAX_EMAILS_PER_HOUR_PER_SENDER=50
MIN_DELAY_MS=2000

# Firebase Admin (credentials embedded in auth.ts)
# No env variable needed - service account is in Backend/src/middleware/auth.ts
```

#### Database Setup

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

#### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `Backend/firebase-service-account.json`
6. The credentials are already configured in `Backend/src/middleware/auth.ts`

#### Start Backend Server

```bash
npm run dev
```

Server runs on `http://localhost:4000`

#### Start Email Worker (Separate Terminal)

```bash
# In Backend directory
npx tsx src/worker/email.worker.ts
```

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Environment Variables

Create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Get Firebase credentials:**
1. Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Copy the config values

#### Start Frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Ethereal Email Setup

**Ethereal** is a fake SMTP service for testing. Emails aren't actually sent but you can preview them.

**Setup (Automatic):**
- The backend automatically creates an Ethereal account on startup
- Check console logs for preview URLs after sending emails
- Example: `Preview: https://ethereal.email/message/xxxxx`

**Manual Setup (Optional):**
1. Visit [ethereal.email](https://ethereal.email/)
2. Click "Create Ethereal Account"
3. Update `Backend/src/worker/email.worker.ts` with credentials:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'your-ethereal-user@ethereal.email',
    pass: 'your-ethereal-password'
  }
});
```

## 🎯 Usage

1. **Login**: Visit `http://localhost:5173` and click "Continue with Google"
2. **Schedule Email**: 
   - Fill in recipient, subject, body
   - Set schedule time (future date/time)
   - Click "Schedule Email"
3. **View Scheduled**: See all pending emails in "Scheduled" tab
4. **View Sent**: See all sent emails in "Sent" tab with timestamps
5. **Preview Emails**: Check backend console for Ethereal preview links

## 🔧 Development

### Run Backend Tests

```bash
cd Backend
npm test # (if tests are set up)
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (DEV ONLY)
npx prisma migrate reset
```

### View Database

```bash
npx prisma studio
```

Opens Prisma Studio on `http://localhost:5555`

## 📦 Tech Stack

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Primary database (via Prisma ORM)
- **Redis** - Queue storage and rate limiting
- **BullMQ** - Job queue for email scheduling
- **Nodemailer** - Email sending
- **Firebase Admin** - Authentication
- **TypeScript** - Type safety

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Firebase SDK** - Authentication
- **Axios** - HTTP client

## 📊 Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  
  emails  Email[]
  senders Sender[]
}

model Sender {
  id        String   @id @default(uuid())
  userId    String
  email     String
  name      String?
  createdAt DateTime @default(now())
  
  user   User    @relation(fields: [userId], references: [id])
  emails Email[]
}

model Email {
  id             String    @id @default(uuid())
  userId         String
  senderId       String
  toEmail        String
  subject        String
  body           String
  scheduledAt    DateTime
  sentAt         DateTime?
  status         String    // scheduled, sending, sent, failed
  idempotencyKey String    @unique
  retryCount     Int       @default(0)
  lastError      String?
  createdAt      DateTime  @default(now())
  
  user   User      @relation(fields: [userId], references: [id])
  sender Sender    @relation(fields: [senderId], references: [id])
  job    EmailJob?
}

model EmailJob {
  id          String    @id @default(uuid())
  emailId     String    @unique
  bullJobId   String?
  scheduledAt DateTime
  processedAt DateTime?
  
  email Email @relation(fields: [emailId], references: [id])
}
```

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if ports are in use
lsof -i :4000

# Verify Redis connection
redis-cli ping # Should return "PONG"

# Check database connection
npx prisma db push
```

### Worker not processing jobs

```bash
# Check Redis connection
redis-cli ping

# View queue status
redis-cli
> KEYS bull:email-queue:*
> LLEN bull:email-queue:wait
```

### Authentication errors

- Verify Firebase config in `frontend/.env`
- Check Firebase service account in `Backend/src/middleware/auth.ts`
- Ensure Firebase Authentication is enabled in console

### Emails not sending

- Check worker is running: `npx tsx src/worker/email.worker.ts`
- Check rate limits in `.env`
- Verify Ethereal preview URLs in console logs

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 🔗 Links

- [Firebase Console](https://console.firebase.google.com/)
- [Ethereal Email](https://ethereal.email/)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Prisma Documentation](https://www.prisma.io/docs/)