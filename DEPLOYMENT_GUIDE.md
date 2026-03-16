# 🚀 Pukaarly Platform - Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Supabase Configuration](#supabase-configuration)
6. [Vercel Deployment](#vercel-deployment)
7. [Production Checklist](#production-checklist)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## ✅ Prerequisites

### **Required Accounts:**
- [x] **GitHub Account** - For code repository
- [x] **Supabase Account** - For database and backend services
- [x] **Vercel Account** - For frontend hosting
- [x] **Domain** (Optional) - For custom domain

### **Local Development Tools:**
```bash
# Required software
- Node.js v18+ (LTS recommended)
- npm or yarn
- Git
- Code editor (VS Code recommended)
```

### **Check Node Version:**
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

---

## 💻 Development Setup

### **Step 1: Clone Repository**

```bash
# Clone the repository
git clone https://github.com/yourusername/pukaarly-platform.git

# Navigate to project directory
cd pukaarly-platform

# Install dependencies
npm install
```

### **Step 2: Install Dependencies**

```bash
# Install all required packages
npm install

# Expected packages installed:
# - next@15.2
# - react@18.3
# - typescript@5.x
# - tailwindcss@3.4
# - supabase@latest
# - And many more...
```

### **Step 3: Verify Installation**

```bash
# Check if all dependencies are installed
npm list --depth=0

# Should show all packages without errors
```

---

## 🔧 Environment Configuration

### **Step 1: Create Environment File**

```bash
# Copy example environment file
cp .env.example .env.local

# Or create manually
touch .env.local
```

### **Step 2: Configure Environment Variables**

Edit `.env.local` with your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Production Configuration
NEXT_PUBLIC_VERCEL_URL=https://your-app.vercel.app
```

### **Step 3: Get Supabase Credentials**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **Environment Variables Explained:**

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Your application URL | ✅ Yes |
| `NEXT_PUBLIC_VERCEL_URL` | Vercel deployment URL | ⚠️ Production only |

---

## 🗄️ Database Setup

### **Step 1: Access Supabase SQL Editor**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in sidebar
4. Click **New Query**

### **Step 2: Run Migration Files**

Execute migration files in order from `supabase/migrations/`:

```sql
-- Run each migration file in order by timestamp
-- Example order:
-- 1. 20260222030900_migration_12a565f4.sql
-- 2. 20260222031134_migration_5308cbf3.sql
-- 3. ... and so on
```

**⚠️ IMPORTANT:** Run migrations in chronological order (by timestamp)!

### **Step 3: Verify Database Schema**

```sql
-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Expected tables:
-- - profiles
-- - wallets
-- - transactions
-- - gifts
-- - gift_transactions
-- - referrals
-- - withdrawals
-- - streams
-- - pk_battles
-- - messages
-- - notifications
-- - agencies
-- - agency_anchors
-- - treasury_logs
```

### **Step 4: Seed Initial Data (Optional)**

```sql
-- Create initial gift catalog
INSERT INTO gifts (name, description, price_coins, category, is_active) 
VALUES 
  ('Rose', 'A beautiful rose', 10, 'basic', true),
  ('Diamond', 'Premium diamond gift', 100, 'premium', true),
  ('Crown', 'Luxury crown', 1000, 'luxury', true);

-- Create admin user (update with your details)
INSERT INTO profiles (email, full_name, role, is_verified)
VALUES ('admin@pukaarly.com', 'Admin User', 'admin', true);
```

---

## ⚙️ Supabase Configuration

### **Step 1: Enable Email Authentication**

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email settings:
   - Enable email confirmations: ✅
   - Enable email change confirmations: ✅
   - Enable secure password change: ✅

### **Step 2: Configure Email Templates**

1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - **Confirm Signup** - Welcome email
   - **Reset Password** - Password reset link
   - **Magic Link** - Passwordless login
   - **Email Change** - Confirm email change

**Example Password Reset Template:**
```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your Pukaarly password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, please ignore this email.</p>
<p>This link expires in 1 hour.</p>
```

### **Step 3: Set Up Storage Buckets**

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('gifts', 'gifts', true),
  ('streams', 'streams', true);

-- Create storage policies
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### **Step 4: Configure Row Level Security (RLS)**

RLS policies are included in migration files, but verify they're active:

```sql
-- Check RLS status for all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- All tables should have rowsecurity = true
```

### **Step 5: Set Up Realtime**

1. Go to **Database** → **Replication**
2. Enable replication for tables:
   - messages (for chat)
   - notifications (for real-time alerts)
   - streams (for live status updates)
   - pk_battles (for battle updates)

### **Step 6: Configure URL Redirects**

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (development)
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/**
   https://your-domain.com/**
   https://*.vercel.app/**
   ```

---

## 🚀 Vercel Deployment

### **Method 1: Deploy via Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import from GitHub:
   - Select `pukaarly-platform` repository
   - Click **Import**
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add **Environment Variables**:
   - Click **Environment Variables** tab
   - Add all variables from `.env.local`
6. Click **Deploy**
7. Wait for deployment to complete (2-3 minutes)

### **Method 2: Deploy via Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? pukaarly-platform
# - In which directory is your code located? ./
# - Want to modify settings? No
```

### **Step 3: Configure Production Environment**

After deployment, update environment variables:

1. Go to **Project Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Add `NEXT_PUBLIC_VERCEL_URL` (automatically set by Vercel)
4. Click **Save**
5. Redeploy for changes to take effect

### **Step 4: Set Up Custom Domain (Optional)**

1. Go to **Project Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `pukaarly.com`)
4. Follow DNS configuration instructions:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. Wait for DNS propagation (5-60 minutes)
6. Verify SSL certificate is issued

### **Step 5: Enable Production Features**

1. **Analytics**: Enable Vercel Analytics
   - Go to **Analytics** tab
   - Click **Enable Analytics**

2. **Speed Insights**: Enable Web Vitals tracking
   - Go to **Speed Insights** tab
   - Click **Enable Speed Insights**

3. **Preview Deployments**: Configure preview settings
   - Go to **Settings** → **Git**
   - Enable preview deployments for pull requests

---

## ✅ Production Checklist

### **Before Launch:**

#### **1. Security Checklist**
- [ ] All API keys are stored in environment variables
- [ ] RLS policies are enabled on all tables
- [ ] JWT secret is secure and not exposed
- [ ] CORS is configured correctly
- [ ] Rate limiting is configured
- [ ] SQL injection prevention is in place
- [ ] XSS protection is enabled

#### **2. Performance Checklist**
- [ ] Images are optimized (Next.js Image component)
- [ ] Code splitting is configured
- [ ] Static pages are pre-rendered
- [ ] Database indexes are created
- [ ] Caching strategy is implemented
- [ ] CDN is configured for assets

#### **3. Functionality Checklist**
- [ ] All authentication flows work
- [ ] Password reset emails are delivered
- [ ] User registration works
- [ ] Role-based access control is enforced
- [ ] Wallet transactions are accurate
- [ ] Gift sending works correctly
- [ ] Withdrawal requests are processed
- [ ] Messaging system works
- [ ] Notifications are delivered

#### **4. User Experience Checklist**
- [ ] Mobile responsiveness is verified
- [ ] Loading states are shown
- [ ] Error messages are user-friendly
- [ ] Success messages are clear
- [ ] Navigation is intuitive
- [ ] Forms have validation
- [ ] Dark mode works correctly

#### **5. Monitoring Checklist**
- [ ] Error tracking is set up (Sentry/LogRocket)
- [ ] Analytics are configured (Google Analytics/Vercel)
- [ ] Uptime monitoring is enabled
- [ ] Database performance monitoring is active
- [ ] API response times are tracked

---

## 🐛 Troubleshooting

### **Common Issues & Solutions:**

#### **1. Build Errors**

**Error:** `Module not found: Can't resolve '@/components/...'`

**Solution:**
```bash
# Check if tsconfig.json has correct paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### **2. Supabase Connection Issues**

**Error:** `Invalid API key` or `Connection refused`

**Solution:**
```bash
# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Check if keys are correct in Supabase dashboard
# Settings → API → Copy keys again

# Restart development server
npm run dev
```

#### **3. Database Migration Errors**

**Error:** `Relation does not exist`

**Solution:**
```sql
-- Check if migrations were run in order
SELECT version FROM schema_migrations ORDER BY version;

-- Rollback and rerun if needed
-- Delete all data and rerun migrations in correct order
```

#### **4. Authentication Errors**

**Error:** `Invalid login credentials`

**Solution:**
```bash
# Check if user exists in database
# Supabase Dashboard → Authentication → Users

# Verify email confirmation
# Check if email is verified

# Reset password if needed
# Use forgot password flow
```

#### **5. Deployment Errors**

**Error:** `Build failed` on Vercel

**Solution:**
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - ESLint errors

# Fix locally first
npm run build
npm run lint

# Then redeploy
vercel --prod
```

#### **6. Environment Variable Issues**

**Error:** `NEXT_PUBLIC_* is undefined`

**Solution:**
```bash
# Environment variables must start with NEXT_PUBLIC_
# to be available in browser

# Restart dev server after adding variables
# Ctrl+C then npm run dev

# For production, redeploy after adding variables
vercel --prod
```

---

## 🔧 Maintenance

### **Regular Maintenance Tasks:**

#### **Daily:**
- [ ] Monitor error logs
- [ ] Check uptime status
- [ ] Review user feedback
- [ ] Monitor database performance

#### **Weekly:**
- [ ] Review withdrawal requests
- [ ] Analyze user engagement metrics
- [ ] Check for security updates
- [ ] Backup database
- [ ] Review support tickets

#### **Monthly:**
- [ ] Update dependencies
- [ ] Review and optimize database
- [ ] Analyze performance metrics
- [ ] Plan feature updates
- [ ] Review security policies

### **Backup Strategy:**

#### **Automatic Backups (Supabase):**
- Daily automatic backups
- 7-day retention for free tier
- 30-day retention for pro tier
- Point-in-time recovery available

#### **Manual Backups:**
```bash
# Export database schema
supabase db dump --schema-only > schema.sql

# Export data only
supabase db dump --data-only > data.sql

# Export everything
supabase db dump > full_backup.sql
```

### **Update Process:**

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test
npm run dev
npm run build
npm run lint

# 3. Commit changes
git add .
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push origin feature/new-feature

# 5. Create pull request
# Review and merge on GitHub

# 6. Deploy to production
# Vercel auto-deploys from main branch
```

### **Database Maintenance:**

```sql
-- Vacuum database monthly
VACUUM ANALYZE;

-- Reindex tables
REINDEX DATABASE your_database;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

---

## 📊 Monitoring Dashboard

### **Key Metrics to Track:**

#### **Application Metrics:**
- Page load time
- API response time
- Error rate
- Uptime percentage
- Active users

#### **Business Metrics:**
- New user registrations
- Daily active users (DAU)
- Transaction volume
- Withdrawal requests
- Revenue generated

#### **Technical Metrics:**
- Database query time
- Cache hit rate
- CPU usage
- Memory usage
- Bandwidth usage

---

## 🆘 Support & Resources

### **Documentation:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Community:**
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- [Vercel Community](https://vercel.com/community)

### **Support Channels:**
- **Email**: support@pukaarly.com
- **Documentation**: docs.pukaarly.com
- **Status Page**: status.pukaarly.com

---

## 🎉 Launch Checklist

### **Final Pre-Launch Steps:**

- [ ] All features tested and working
- [ ] Performance optimization complete
- [ ] Security audit passed
- [ ] Legal pages added (Terms, Privacy)
- [ ] Contact/support page created
- [ ] Monitoring tools configured
- [ ] Backup strategy implemented
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Custom domain configured
- [ ] SSL certificate issued
- [ ] Email templates customized
- [ ] Social media links added
- [ ] SEO optimization complete
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility tested
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on platform
- [ ] Support system ready
- [ ] Marketing materials prepared

---

**🚀 You're ready to launch Pukaarly Platform!**

**Deployment Version:** 1.0  
**Last Updated:** March 16, 2026  
**Status:** ✅ Production Ready

---

*Keep this guide updated as the deployment process evolves.*