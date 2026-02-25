# 🚀 Pukaarly Platform - Production Deployment Guide

**Last Updated:** February 25, 2026  
**Platform:** Vercel + Supabase  
**Estimated Time:** 15-20 minutes

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ GitHub account (for code repository)
- ✅ Vercel account (free tier works fine)
- ✅ Supabase project (already connected)
- ✅ Custom domain (optional, but recommended)
- ✅ All code tested locally

---

## 🎯 Deployment Process (Step-by-Step)

### **STEP 1: Prepare Your Code for Production**

#### 1.1 Verify Environment Variables

Check your `.env.local` file contains:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**⚠️ IMPORTANT:** These will be added to Vercel separately. Never commit `.env.local` to Git.

#### 1.2 Update Site URL in Supabase

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL** to your production domain:
   ```
   https://your-domain.com
   or
   https://your-project.vercel.app
   ```

3. Add **Redirect URLs** (wildcard pattern):
   ```
   https://*.vercel.app/**
   https://your-domain.com/**
   ```

#### 1.3 Verify Production Configuration

Check `next.config.mjs`:
```javascript
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'your-project.supabase.co',
      'images.unsplash.com',
      'avatar.vercel.sh'
    ],
  },
  // Production optimizations are already configured
};
```

---

### **STEP 2: Push Code to GitHub**

#### 2.1 Initialize Git Repository (if not already done)

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: Complete Pukaarly platform with streaming and PK battles"

# Create GitHub repository and add remote
git remote add origin https://github.com/yourusername/pukaarly-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 2.2 Verify Repository

Go to `https://github.com/yourusername/pukaarly-platform` and confirm:
- ✅ All files are uploaded
- ✅ `.env.local` is NOT in the repository (check `.gitignore`)
- ✅ Code structure looks correct

---

### **STEP 3: Deploy to Vercel**

#### 3.1 Import Project to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import GitHub Repository:**
   - Select "Import Git Repository"
   - Choose your GitHub account
   - Find and select `pukaarly-platform`
   - Click "Import"

#### 3.2 Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

```yaml
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

**✅ These are already correct - no changes needed!**

#### 3.3 Add Environment Variables

In the Vercel project settings, add these environment variables:

**Click "Environment Variables" tab:**

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview, Development |

**How to get these values:**
1. Go to Supabase Dashboard
2. Click "Project Settings" → "API"
3. Copy "Project URL" and "anon public" key

#### 3.4 Deploy!

1. Click "Deploy" button
2. Wait for build to complete (2-3 minutes)
3. Vercel will provide a deployment URL: `https://pukaarly-platform.vercel.app`

---

### **STEP 4: Post-Deployment Configuration**

#### 4.1 Update Supabase Authentication URLs

1. **Go to Supabase Dashboard** → Authentication → URL Configuration
2. **Update Site URL:**
   ```
   https://pukaarly-platform.vercel.app
   ```

3. **Add Redirect URLs:**
   ```
   https://pukaarly-platform.vercel.app/**
   https://pukaarly-platform-*.vercel.app/**
   ```

4. Click "Save"

#### 4.2 Test Authentication Flow

1. Visit your deployed site
2. Try registering a new account
3. Check email for verification link
4. Verify login works correctly

**⚠️ Common Issue:** If authentication redirects fail:
- Double-check redirect URLs in Supabase
- Ensure they include `/**` wildcard
- Clear browser cache and try again

#### 4.3 Create Admin Account

**Option 1: Via Database Console**
1. Go to Supabase Dashboard → Database → Tables
2. Open `profiles` table
3. Find your user and set `role = 'admin'`

**Option 2: Via SQL Editor**
```sql
-- Update your user to admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

#### 4.4 Verify All Features

Test each major feature:
- ✅ User registration and login
- ✅ Dashboard access for each role
- ✅ Wallet operations
- ✅ Stream creation (anchor role)
- ✅ Gift sending
- ✅ PK battle invitations
- ✅ Real-time chat
- ✅ Admin controls

---

### **STEP 5: Custom Domain Setup (Optional)**

#### 5.1 Add Domain in Vercel

1. Go to Vercel Project Settings → "Domains"
2. Click "Add Domain"
3. Enter your domain: `pukaarly.com`
4. Click "Add"

#### 5.2 Configure DNS Records

Add these records to your domain provider (GoDaddy, Namecheap, Cloudflare, etc.):

**For Root Domain (`pukaarly.com`):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For WWW Subdomain (`www.pukaarly.com`):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### 5.3 Wait for DNS Propagation

- DNS changes take 5-60 minutes
- Vercel will automatically issue SSL certificate
- Your site will be available at `https://pukaarly.com`

#### 5.4 Update Supabase URLs

Go back to Supabase → Authentication → URL Configuration:
```
Site URL: https://pukaarly.com
Redirect URLs: https://pukaarly.com/**
```

---

## 🔒 Security Checklist

After deployment, verify these security measures:

### **Database Security:**
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies restrict access by role and user_id
- ✅ API keys are environment variables (not hardcoded)
- ✅ Supabase anon key is public (safe for client-side)

### **Authentication Security:**
- ✅ Email verification required
- ✅ Password reset flow secured
- ✅ JWT tokens expire properly
- ✅ Role-based access enforced

### **Application Security:**
- ✅ HTTPS enforced (Vercel default)
- ✅ No sensitive data in client-side code
- ✅ CORS configured properly
- ✅ Input validation on all forms

---

## 📊 Monitoring & Analytics

### **Vercel Analytics (Built-in)**

1. Go to Vercel Project → "Analytics"
2. View:
   - Page views
   - Unique visitors
   - Performance metrics
   - Error rates

### **Supabase Monitoring**

1. Go to Supabase Dashboard → "Logs"
2. Monitor:
   - Database queries
   - API requests
   - Authentication events
   - Real-time connections

### **Error Tracking**

Check these for errors:
- Vercel deployment logs
- Supabase database logs
- Browser console errors
- Network tab for failed requests

---

## 🐛 Common Deployment Issues & Solutions

### **Issue 1: Build Fails**

**Error:** `Type error: Cannot find module...`

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### **Issue 2: Environment Variables Not Working**

**Error:** `Supabase client not initialized`

**Solution:**
1. Verify env vars in Vercel project settings
2. Ensure they're set for all environments (Production, Preview, Development)
3. Redeploy after adding variables

### **Issue 3: Authentication Redirect Fails**

**Error:** `Invalid redirect URL`

**Solution:**
1. Check Supabase → Authentication → URL Configuration
2. Add wildcard: `https://*.vercel.app/**`
3. Include production domain with `/**`
4. Clear browser cache

### **Issue 4: Real-time Features Not Working**

**Error:** `WebSocket connection failed`

**Solution:**
1. Verify Supabase real-time is enabled
2. Check tables have real-time enabled:
   ```sql
   ALTER TABLE streams REPLICA IDENTITY FULL;
   ALTER PUBLICATION supabase_realtime ADD TABLE streams;
   ```

### **Issue 5: Images Not Loading**

**Error:** `Image optimization error`

**Solution:**
1. Add domain to `next.config.mjs`:
   ```javascript
   images: {
     domains: ['your-project.supabase.co']
   }
   ```
2. Redeploy

---

## 🎯 Post-Deployment Tasks

### **Immediate Tasks:**

1. ✅ **Create Admin Account**
   - Register via `/auth/register`
   - Update role to `admin` in database
   - Login to `/admin/dashboard`

2. ✅ **Create Test Accounts**
   - Go to `/admin/create-proxy-users`
   - Generate 10-20 test users
   - Assign roles (users, anchors, agencies)

3. ✅ **Configure Gift Catalog**
   - Go to `/admin/gifts`
   - Add/edit virtual gifts
   - Set pricing and images

4. ✅ **Test Core Flows**
   - User registration → verification → login
   - Anchor go-live → stream → receive gifts
   - PK battle invitation → acceptance → scoring
   - Withdrawal request → admin approval

### **24-Hour Tasks:**

1. ✅ **Monitor Performance**
   - Check Vercel analytics
   - Review Supabase logs
   - Identify slow queries

2. ✅ **Test Edge Cases**
   - Concurrent users
   - Multiple streams
   - High gift volume
   - PK battles

3. ✅ **Gather Feedback**
   - Test with real users
   - Document bugs/issues
   - Prioritize fixes

### **Weekly Tasks:**

1. ✅ **Review Metrics**
   - User growth
   - Transaction volume
   - Stream statistics
   - Error rates

2. ✅ **Database Maintenance**
   - Review slow queries
   - Optimize indexes
   - Clean up old data

3. ✅ **Security Audit**
   - Check for vulnerabilities
   - Update dependencies
   - Review RLS policies

---

## 📈 Scaling Considerations

### **When to Scale:**

**User Growth Triggers:**
- 1,000+ daily active users
- 50+ concurrent streams
- 10,000+ transactions/day
- Performance degradation

### **Scaling Options:**

**Supabase Scaling:**
- Upgrade to Pro plan ($25/month)
- Increase connection pool size
- Add read replicas
- Enable point-in-time recovery

**Vercel Scaling:**
- Upgrade to Pro plan ($20/month)
- Add more serverless functions
- Enable Edge Functions
- Add custom caching

**Database Optimization:**
- Add composite indexes
- Implement query caching
- Use materialized views
- Archive old data

---

## 🎓 Maintenance Guide

### **Daily Monitoring:**
- Check error logs (Vercel + Supabase)
- Monitor uptime (should be 99.9%+)
- Review pending withdrawals
- Check real-time connections

### **Weekly Maintenance:**
- Review user growth metrics
- Process manual withdrawals
- Update gift catalog if needed
- Respond to user support tickets

### **Monthly Maintenance:**
- Database performance review
- Security audit
- Dependency updates
- Backup verification
- Cost analysis

---

## 💰 Cost Breakdown

### **Current Setup (Free Tier):**

**Supabase:**
- Database: 500MB included
- Auth: Unlimited users
- Storage: 1GB included
- Bandwidth: 2GB included
- **Cost:** $0/month

**Vercel:**
- Hosting: 100GB bandwidth
- Serverless: 100 hours
- Deployments: Unlimited
- **Cost:** $0/month

**Total:** $0/month (up to 1,000 users)

### **Growth Scaling:**

**At 1,000 Users:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- **Total:** $45/month

**At 10,000 Users:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Additional bandwidth: ~$30/month
- **Total:** $75/month

**At 100,000 Users:**
- Supabase Team: $599/month
- Vercel Enterprise: Custom pricing
- CDN: ~$200/month
- **Total:** $800-1,500/month

---

## 📞 Support Resources

### **Vercel Support:**
- Documentation: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Twitter: @vercel

### **Supabase Support:**
- Documentation: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

### **Next.js Support:**
- Documentation: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js
- Discord: https://nextjs.org/discord

---

## ✅ Deployment Complete!

Your Pukaarly platform is now live in production! 🎉

**Your Deployment URLs:**
- **Production:** https://pukaarly-platform.vercel.app
- **Custom Domain:** https://pukaarly.com (if configured)
- **Admin Dashboard:** https://pukaarly.com/admin/dashboard
- **API Docs:** https://pukaarly.com/api (if enabled)

**Next Steps:**
1. Share the link with beta testers
2. Monitor performance and errors
3. Gather user feedback
4. Implement Phase 2 features
5. Scale as needed

---

**🚀 Congratulations on your successful deployment!**

*For additional help, refer to the main PROJECT_COMPLETION_DOCUMENT.md*