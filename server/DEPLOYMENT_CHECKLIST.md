# 🚀 Backend Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Node.js 18+ installed on server
- [ ] MySQL database created and accessible
- [ ] SSH access to server configured
- [ ] Domain/subdomain pointing to server

### ✅ Files Uploaded
- [ ] All server files uploaded to hosting server
- [ ] File permissions set correctly
- [ ] `.env` file created with production values
- [ ] Database schema imported

### ✅ Dependencies
- [ ] `npm install --production` completed
- [ ] All required packages installed
- [ ] No development dependencies in production

### ✅ Configuration
- [ ] Database credentials updated in `.env`
- [ ] JWT_SECRET set to secure random string
- [ ] CORS_ORIGIN set to your domain
- [ ] NODE_ENV set to 'production'
- [ ] PORT configured correctly

## Deployment Steps

### 1. Server Preparation
```bash
# Connect to your server
ssh user@your-server.com

# Navigate to server directory
cd /path/to/server

# Install dependencies
npm install --production

# Create logs directory
mkdir -p logs
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your production values
nano .env
```

### 3. Database Setup
```bash
# Import database schema
mysql -u username -p database_name < ../docs/astro_forge_db.sql

# Test database connection
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
pool.getConnection()
  .then(conn => {
    console.log('✅ Database connected');
    conn.release();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database failed:', err.message);
    process.exit(1);
  });
"
```

### 4. Process Management Setup

#### Option A: PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Option B: Systemd Service
```bash
# Create service file
sudo nano /etc/systemd/system/astro-forge-backend.service

# Enable and start service
sudo systemctl enable astro-forge-backend
sudo systemctl start astro-forge-backend
```

#### Option C: Direct Node.js
```bash
# Start application
npm start
```

## Post-Deployment Verification

### ✅ Health Checks
```bash
# Test server health
curl http://your-domain.com:3001/api/health

# Test database connection
curl http://your-domain.com:3001/api/db/test

# Check application logs
pm2 logs astro-forge-backend
# or
tail -f logs/out.log
```

### ✅ API Endpoints Test
```bash
# Test services endpoint
curl http://your-domain.com:3001/api/services

# Test blog posts endpoint
curl http://your-domain.com:3001/api/blog-posts

# Test theme settings endpoint
curl http://your-domain.com:3001/api/theme-settings
```

### ✅ Security Verification
- [ ] HTTPS enabled and working
- [ ] CORS properly configured
- [ ] Security headers present
- [ ] JWT_SECRET is secure
- [ ] Database credentials are secure

### ✅ Performance Checks
- [ ] Server responds within 2 seconds
- [ ] Database queries are optimized
- [ ] File uploads working correctly
- [ ] Static files served properly

## Monitoring Setup

### ✅ Log Monitoring
```bash
# PM2 logs
pm2 logs astro-forge-backend

# System logs
journalctl -u astro-forge-backend -f

# Application logs
tail -f logs/out.log
tail -f logs/err.log
```

### ✅ Process Monitoring
```bash
# PM2 status
pm2 status

# System resource usage
htop
df -h
free -h
```

### ✅ Database Monitoring
```bash
# Check database connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Check database size
mysql -u root -p -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = 'astro_forge_db';"
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### Database Connection Failed
```bash
# Check database service
sudo systemctl status mysql

# Test connection manually
mysql -u username -p -h hostname database_name
```

#### Permission Denied
```bash
# Fix file permissions
chmod +x deploy.sh
chmod 755 logs/
chown -R user:user /path/to/server
```

#### PM2 Issues
```bash
# Restart PM2
pm2 restart astro-forge-backend

# Delete and recreate
pm2 delete astro-forge-backend
pm2 start ecosystem.config.js --env production
```

## Backup Strategy

### ✅ Database Backup
```bash
# Create backup script
nano backup-db.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

### ✅ Application Backup
```bash
# Backup application files
tar -czf astro-forge-backend-$(date +%Y%m%d).tar.gz /path/to/server

# Backup logs
tar -czf logs-$(date +%Y%m%d).tar.gz logs/
```

## Security Checklist

### ✅ Network Security
- [ ] Firewall configured
- [ ] Only necessary ports open
- [ ] SSH key-based authentication
- [ ] Fail2ban installed

### ✅ Application Security
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection enabled

### ✅ Database Security
- [ ] Strong passwords used
- [ ] Database user has minimal privileges
- [ ] Regular security updates
- [ ] Backup encryption

## Performance Optimization

### ✅ Server Optimization
- [ ] Node.js optimized for production
- [ ] Database connection pooling
- [ ] Static file caching
- [ ] Gzip compression enabled

### ✅ Monitoring Setup
- [ ] Application performance monitoring
- [ ] Database query monitoring
- [ ] Error tracking
- [ ] Uptime monitoring

## Final Verification

### ✅ Complete System Test
- [ ] All API endpoints working
- [ ] Frontend can connect to backend
- [ ] File uploads functioning
- [ ] Admin panel accessible
- [ ] Database operations working
- [ ] Error handling working
- [ ] Logs being generated

### ✅ Documentation
- [ ] Deployment notes updated
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] Contact information for support

## 🎉 Deployment Complete!

Your Astro Forge backend is now deployed and ready for production use! 