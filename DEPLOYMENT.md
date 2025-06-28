# 🚀 Astro Forge Holdings - Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 2: Netlify (Free)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Option 3: GitHub Pages
```bash
# Build the project
npm run build:prod

# Deploy to GitHub Pages via GitHub Actions
```

## 🔧 Pre-Deployment Setup

### 1. Environment Variables
Create `.env` file for production:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_TITLE=Astro Forge Holdings
VITE_APP_DESCRIPTION=Leading provider of innovative solutions
NODE_ENV=production
```

### 2. Build the Project
```bash
npm run build:prod
```

### 3. Test Locally
```bash
npm run preview
```

## 🌐 Backend Deployment

### Railway (Recommended)
1. Connect your GitHub repo to Railway
2. Set environment variables:
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `NODE_ENV=production`
3. Deploy

### Render
1. Create new Web Service
2. Connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Set environment variables

### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

## 📊 Database Setup

### MySQL on Railway/Render
1. Create MySQL database service
2. Import schema: `docs/astro_forge_db.sql`
3. Update backend environment variables

### PlanetScale (Alternative)
1. Create database on PlanetScale
2. Import schema
3. Update connection string

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Database credentials secure
- [ ] CORS configured for production domain
- [ ] API rate limiting enabled
- [ ] Security headers configured

## 📱 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update backend CORS for production domain
2. **API 404**: Check API base URL in frontend
3. **Database Connection**: Verify environment variables
4. **Build Failures**: Check Node.js version compatibility

### Support:
- Check build logs in deployment platform
- Verify environment variables
- Test API endpoints
- Check database connectivity

## 📈 Post-Deployment

1. Test all features
2. Verify admin login
3. Check mobile responsiveness
4. Test contact forms
5. Monitor performance
6. Set up analytics

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:prod
      - run: npm run deploy
```

Your site is now ready for deployment! Choose your preferred platform and follow the steps above. 