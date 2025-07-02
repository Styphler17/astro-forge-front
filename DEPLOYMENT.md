# 🚀 Astro Forge Holdings - Deployment Guide

This guide covers deploying both the frontend and backend of Astro Forge Holdings to production.

## 📋 Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+ database
- Web hosting provider (e.g., Hostinger, Vercel, Netlify)
- Domain name (optional but recommended)

## 🏗️ Frontend Deployment

### Option 1: Static Hosting (Recommended)

#### 1. Build the Project

```bash
# Run the deployment script
./deploy.sh

# Or manually:
npm run deploy:full
```

#### 2. Deploy to Hosting Provider

**Hostinger:**
1. Upload the `dist/` folder contents to your hosting directory
2. Ensure `.htaccess` is in the root directory
3. Configure your domain to point to the hosting

**Vercel:**
1. Connect your GitHub repository
2. Set build command: `npm run build:prod`
3. Set output directory: `dist`
4. Deploy

**Netlify:**
1. Drag and drop the `dist/` folder
2. Or connect your repository and set build settings

### Option 2: VPS/Server Deployment

```bash
# Build the project
npm run build:prod

# Copy dist folder to server
scp -r dist/ user@your-server:/var/www/html/

# Set proper permissions
chmod -R 755 /var/www/html/
```

## 🔧 Backend Deployment

### Option 1: VPS/Server Deployment

#### 1. Prepare the Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

#### 2. Deploy Backend

```bash
# Navigate to server directory
cd server

# Run deployment script
./deploy.sh

# Or manually:
npm ci --production
```

#### 3. Configure Environment

```bash
# Create production environment file
cp env.example .env
nano .env
```

Update `.env` with production values:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_production_user
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=astro_forge_db
NODE_ENV=production
PORT=3001
```

#### 4. Set Up Process Manager

```bash
# Install PM2
sudo npm install -g pm2

# Start the application
pm2 start server.js --name "astro-forge-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: Platform as a Service

**Railway:**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

**Render:**
1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`

## 🗄️ Database Setup

### 1. Create Production Database

```sql
CREATE DATABASE astro_forge_db;
CREATE USER 'astro_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON astro_forge_db.* TO 'astro_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Import Schema

```bash
# Import the database schema
mysql -u astro_user -p astro_forge_db < docs/astro_forge_db.sql
```

### 3. Create Admin User

```sql
INSERT INTO users (email, password_hash, name, role, is_active) 
VALUES ('admin@astroforge.com', '$2a$10$your_hashed_password', 'Admin User', 'admin', 1);
```

## 🔒 Security Configuration

### 1. SSL/HTTPS Setup

```bash
# Install Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-apache -y

# Get SSL certificate
sudo certbot --apache -d yourdomain.com
```

### 2. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. Database Security

```sql
-- Remove root access from remote hosts
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Create application-specific user with limited privileges
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON astro_forge_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🌐 Domain Configuration

### 1. DNS Settings

Configure your domain's DNS:
- A record: Point to your server IP
- CNAME record: www → yourdomain.com

### 2. Environment Variables

Update frontend environment variables:
```env
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_APP_TITLE=Astro Forge Holdings
NODE_ENV=production
```

## 📊 Monitoring & Maintenance

### 1. Log Management

```bash
# View application logs
pm2 logs astro-forge-backend

# View system logs
sudo journalctl -u nginx
sudo tail -f /var/log/mysql/error.log
```

### 2. Backup Strategy

```bash
# Database backup script
#!/bin/bash
mysqldump -u astro_user -p astro_forge_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3. Performance Monitoring

- Set up monitoring with PM2: `pm2 monit`
- Configure log rotation
- Set up automated backups

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:prod
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/astro-forge
            git pull
            npm ci --production
            pm2 restart astro-forge-backend
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS settings match frontend domain
2. **Database Connection**: Check MySQL service and credentials
3. **Build Failures**: Verify Node.js version and dependencies
4. **Routing Issues**: Ensure `.htaccess` is properly configured

### Debug Commands

```bash
# Check application status
pm2 status
pm2 logs

# Test database connection
mysql -u user -p -h host database

# Check server resources
htop
df -h
free -h
```

## 📞 Support

For deployment issues:
1. Check the logs: `pm2 logs` or hosting provider logs
2. Verify environment variables
3. Test database connectivity
4. Review security configurations

---

**Remember**: Always test your deployment in a staging environment first! 