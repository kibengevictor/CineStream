# 🚀 VideoSource Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Step 1: Prepare Your Code
1. **Initialize Git Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - VideoSource streaming app"
   ```

2. **Push to GitHub:**
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/videosource.git
   git branch -M main
   git push -u origin main
   ```

#### Step 2: Deploy to Vercel
1. **Visit:** https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Import Project:** Click "New Project" → Import from GitHub
4. **Select Repository:** Choose your VideoSource repository
5. **Configure:**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: Leave default
6. **Deploy:** Click Deploy!

#### Step 3: Your App is Live! 🎉
- You'll get a live URL like: `https://videosource-abc123.vercel.app`
- Vercel automatically handles:
  - SSL certificates
  - Global CDN
  - Automatic deployments on git push

---

### Option 2: Netlify

#### Step 1: Build for Static Export
1. Update `next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   module.exports = nextConfig
   ```

2. **Build:** `npm run build`

#### Step 2: Deploy to Netlify
1. **Visit:** https://netlify.com
2. **Drag & Drop:** Upload the `out` folder
3. **Your app is live!**

---

### Option 3: Railway

#### Step 1: Push to GitHub (same as Vercel)

#### Step 2: Deploy to Railway
1. **Visit:** https://railway.app
2. **New Project** → Deploy from GitHub
3. **Select Repository:** Choose VideoSource
4. **Deploy:** Railway handles the rest!

---

## Environment Variables (Optional)

If you want to use your own TMDB API key:

1. **Get TMDB API Key:**
   - Visit: https://www.themoviedb.org/settings/api
   - Create account and request API key

2. **Add to Vercel:**
   - Go to your project dashboard
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_TMDB_API_KEY` = `your_api_key_here`

3. **Redeploy:** Vercel will automatically redeploy

---

## Custom Domain (Optional)

### Add Your Own Domain:
1. **Buy a domain** (from Namecheap, GoDaddy, etc.)
2. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Add your domain
   - Follow DNS instructions

---

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Node.js version (use 18+)
   - Ensure all dependencies are installed

2. **TMDB API Issues:**
   - Verify API key is correct
   - Check rate limits

3. **Video Not Loading:**
   - Vidsrc might be blocked in some regions
   - Try different content

---

## What You Get After Deployment:

✅ **Live streaming app**  
✅ **Global CDN (fast worldwide)**  
✅ **SSL certificate (https)**  
✅ **Automatic deployments**  
✅ **Professional URL**  
✅ **Mobile responsive**  
✅ **Search functionality**  
✅ **Real movie data**  

## Next Steps:

1. **Share your app** with friends and family
2. **Add custom domain** for professional look
3. **Monitor usage** in platform dashboard
4. **Update content** by pushing to GitHub

---

# 🎉 Your VideoSource App Will Be Live in Minutes!

Choose your preferred deployment method above and follow the steps. Vercel is recommended for beginners due to its simplicity and excellent Next.js integration.
