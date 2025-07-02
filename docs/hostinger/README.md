# AstroForge Hostinger Deployment Backup

This folder contains a complete backup of the AstroForge project ready for deployment on Hostinger.

## Contents

- **frontend/** - Production-ready React frontend build
- **backend/** - Node.js backend server with all dependencies
- **astro_forge_db.sql** - Complete database schema and sample data

## Deployment Instructions

### Frontend Deployment (Hostinger Shared Hosting)

1. **Upload Frontend Files:**
   - Upload all contents of the `frontend/` folder to your Hostinger public_html directory
   - The `.htaccess` file is already included for proper routing

2. **Configure Domain:**
   - Point your domain to the public_html directory
   - The frontend will be accessible at your domain root

### Backend Deployment (Hostinger VPS/Dedicated Server)

1. **Upload Backend Files:**
   - Upload the `backend/` folder to your server
   - Navigate to the backend directory

2. **Install Dependencies:**
   ```bash
   npm install --production
   ```

3. **Configure Environment:**
   - Create a `.env` file in the backend directory
   - Set your production database credentials and other environment variables

4. **Start the Server:**
   ```bash
   npm start
   ```

### Database Setup

1. **Create Database:**
   - Create a MySQL database in your Hostinger control panel
   - Note the database name, username, password, and host

2. **Import Schema:**
   - Import the `astro_forge_db.sql` file into your database
   - This will create all necessary tables and sample data

3. **Update Backend Configuration:**
   - Update the database connection settings in your backend `.env` file

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name

# Server Configuration
PORT=3001
NODE_ENV=production

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Email Configuration (if using email features)
EMAIL_HOST=your-email-host
EMAIL_PORT=587
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-password
```

## Important Notes

- The frontend is configured to connect to the backend API
- Make sure your backend server is accessible from the frontend
- Update the API base URL in the frontend if needed
- The `.htaccess` file handles client-side routing for the React app
- All static assets are optimized and minified for production

## Support

For deployment issues, refer to the main project documentation or contact support. 