# Astro Forge Backend - Production Deployment Guide

This guide will help you deploy the Astro Forge backend to Hostinger or any other hosting provider.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ installed on your server
- MySQL database access
- SSH access to your server

### 1. Upload Files
Upload the entire `server/` folder to your hosting server.

### 2. Install Dependencies
```bash
cd server
npm install --production
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your production values
```

### 4. Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📋 Detailed Setup

### Environment Variables (.env)
Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# Database Configuration
MYSQL_HOST=your-production-db-host
MYSQL_PORT=3306
MYSQL_USER=your-db-username
MYSQL_PASSWORD=your-db-password
MYSQL_DATABASE=astro_forge_db

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-here

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/astroforge-uploads
```

### Database Setup
1. Create a MySQL database on your hosting provider
2. Import the database schema from `../docs/astro_forge_db.sql`
3. Update the database credentials in your `.env` file

### Process Management

#### Option 1: PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Option 2: Direct Node.js
```bash
npm start
```

#### Option 3: Systemd Service
Create `/etc/systemd/system/astro-forge-backend.service`:
```ini
[Unit]
Description=Astro Forge Backend
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/server
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then enable and start:
```bash
sudo systemctl enable astro-forge-backend
sudo systemctl start astro-forge-backend
```

## 🔧 Configuration

### CORS Settings
Update CORS configuration in `server.js` for production:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
  credentials: true
}));
```

### File Uploads
The backend handles file uploads to `./public/astroforge-uploads/`. Ensure this directory exists and is writable.

### Security Headers
Consider adding security headers:
```javascript
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## 📊 Monitoring

### Logs
- Application logs: `./logs/`
- PM2 logs: `pm2 logs`
- System logs: `journalctl -u astro-forge-backend`

### Health Check
Test your deployment:
```bash
curl http://your-domain.com:3001/api/health
```

### Database Connection Test
```bash
curl http://your-domain.com:3001/api/db/test
```

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Use environment variables for sensitive data
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database backup strategy

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -i :3001
   kill -9 <PID>
   ```

2. **Database connection failed**
   - Check database credentials
   - Verify database server is running
   - Check firewall settings

3. **Permission denied**
   ```bash
   chmod +x deploy.sh
   chmod 755 logs/
   ```

4. **PM2 not found**
   ```bash
   npm install -g pm2
   ```

### Logs Location
- PM2: `pm2 logs astro-forge-backend`
- Direct: `./logs/out.log` and `./logs/err.log`

## 📞 Support

If you encounter issues:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Test database connectivity
4. Ensure all dependencies are installed

## 🔄 Updates

To update the backend:
1. Upload new files
2. Restart the application:
   ```bash
   pm2 restart astro-forge-backend
   # or
   npm start
   ``` 