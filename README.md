# Astro Forge Holdings

A modern, responsive corporate website built with React, TypeScript, and Tailwind CSS. Features a comprehensive admin dashboard, blog system, careers portal, and contact management.

## 🚀 Live Demo

- **Frontend**: [Your deployed URL here]
- **Admin Dashboard**: [Your deployed URL here]/admin
- **Demo Credentials**: admin@astroforge.com / AstroForge2024!

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: Custom admin system
- **Deployment**: Hostinger

## 📋 Features

### Public Pages

- ✅ Responsive homepage with hero section
- ✅ About us with company information
- ✅ Services showcase with detailed pages
- ✅ Projects portfolio with filtering
- ✅ Blog system with categories
- ✅ Careers portal with job applications
- ✅ Contact form with message management
- ✅ FAQ section
- ✅ Privacy Policy & Terms of Service

### Admin Dashboard

- ✅ Content management (Blog, Projects, Services)
- ✅ Team member management
- ✅ User management system
- ✅ Contact message handling
- ✅ Site settings configuration
- ✅ Analytics dashboard
- ✅ Theme customization
- ✅ Career portal management

## 🏠 Local Development Setup

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MySQL 8.0+** - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd astro-forge-front

# Verify you're in the correct directory
ls
# Should show: src/, server/, package.json, etc.
```

### Step 2: Database Setup

```bash
# 1. Create MySQL database
mysql -u root -p
CREATE DATABASE astro_forge_db;
USE astro_forge_db;

# 2. Import the database schema
mysql -u root -p astro_forge_db < docs/astro_forge_db.sql

# 3. Create a database user (optional but recommended)
CREATE USER 'astro_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON astro_forge_db.* TO 'astro_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create environment file
copy env.example .env
```

**Edit `server/.env`:**

```env
DB_HOST=localhost
DB_USER=astro_user
DB_PASSWORD=your_secure_password
DB_NAME=astro_forge_db
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3001
NODE_ENV=development
```

```bash
# Start backend server
npm start

# You should see:
# 🚀 Server running on <http://localhost:3001>
# 📊 API endpoints available at <http://localhost:3001/api>
# ✅ MySQL database connected successfully
```

### Step 4: Frontend Setup

```bash
# Open a new terminal and navigate to project root
cd astro-forge-front

# Install frontend dependencies
npm install

# Create environment file
copy env.example .env
```

**Edit `.env`:**

```env
VITE_API_BASE_URL=<http://localhost:3001/api>
VITE_APP_TITLE=Astro Forge Holdings
NODE_ENV=development
```

```bash
# Start development server
npm run dev

# You should see:
# Local:   <http://localhost:5173/>
# Network: <http://192.168.x.x:5173/>
```

### Step 5: Verify Installation

1. **Frontend**: Open <http://localhost:5173>
2. **Backend API**: Open <http://localhost:3001/api>
3. **Admin Dashboard**: Open <http://localhost:5173/admin>
   - Login with: admin@astroforge.com / AstroForge2024!

## 🚀 Hostinger Deployment Guide

### Backend Deployment (Node.js Hosting)

#### Step 1: Prepare Backend for Production

```bash
# In the server directory
cd server

# Install production dependencies
npm install --production

# Create production environment file
copy env.example .env.production
```

**Edit `server/.env.production`:**

```env
DB_HOST=your_hostinger_mysql_host
DB_USER=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password
DB_NAME=your_hostinger_db_name
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3001
NODE_ENV=production
CORS_ORIGIN=<https://your-frontend-domain.com>
```

#### Step 2: Upload Backend to Hostinger

1. **Access Hostinger Control Panel**

   - Login to Hostinger
   - Go to "Hosting" → "Manage"
   - Click "File Manager"

2. **Upload Backend Files**

   - Navigate to `public_html` or your Node.js directory
   - Upload all files from the `server/` folder
   - Ensure `server.js` is in the root of your Node.js directory

3. **Configure Node.js App**

   - In Hostinger Control Panel, go to "Node.js"
   - Set Node.js version to 18.x or higher
   - Set startup file to `server.js`
   - Set Node.js URL (e.g., `<https://api.yourdomain.com>`)

4. **Database Configuration**

   - Go to "Databases" → "MySQL"
   - Create a new database
   - Import the schema: `docs/astro_forge_db.sql`
   - Update `.env.production` with new database credentials

5. **Start Backend**

   - In Node.js settings, click "Restart"
   - Check logs for any errors
   - Test API: `<https://api.yourdomain.com/api>`

### Frontend Deployment (Web Hosting)

#### Step 1: Build Frontend for Production

```bash
# In the project root
cd astro-forge-front

# Create production environment file
copy env.example .env.production
```

**Edit `.env.production`:**

```env
VITE_API_BASE_URL=<https://api.yourdomain.com/api>
VITE_APP_TITLE=Astro Forge Holdings
NODE_ENV=production
```

```bash
# Build for production
npm run build:prod

# This creates a `dist/` folder with optimized files
```

#### Step 2: Upload Frontend to Hostinger

1. **Access File Manager**

   - Go to "File Manager" in Hostinger Control Panel
   - Navigate to `public_html`

2. **Upload Frontend Files**

   - Delete existing files (if any)
   - Upload all contents from the `dist/` folder
   - Ensure `index.html` is in the root of `public_html`

3. **Configure Domain**

   - Go to "Domains" → "Manage"
   - Point your domain to the hosting
   - Enable SSL certificate

4. **Set up URL Rewriting (for React Router)**

   - Create `.htaccess` file in `public_html`:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Step 3: Final Configuration

#### Update CORS Settings

In your backend `.env.production`:

```env
CORS_ORIGIN=<https://yourdomain.com>
```

#### Test Deployment

1. **Frontend**: <https://yourdomain.com>
2. **Admin Dashboard**: <https://yourdomain.com/admin>
3. **API**: <https://api.yourdomain.com/api>

## 🔧 Development Commands

```bash
# Frontend Development
npm run dev              # Start development server
npm run build:dev        # Development build
npm run build:prod       # Production build
npm run preview          # Preview production build
npm run lint             # Run linter
npm run type-check       # TypeScript checking

# Backend Development
cd server
npm start                # Start backend server
npm run dev              # Start with nodemon (if configured)
```

## 📁 Project Structure

```text
astro-forge-front/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin dashboard components
│   │   ├── ui/             # Reusable UI components
│   │   └── forms/          # Form components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # API and database
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript types
├── server/                 # Backend API
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Backend environment
├── public/                 # Static assets
├── docs/                   # Documentation and database
├── dist/                   # Production build
└── package.json           # Frontend dependencies
```

## 🔒 Security Checklist

- ✅ Use strong JWT secrets
- ✅ Enable HTTPS in production
- ✅ Configure CORS properly
- ✅ Use environment variables
- ✅ Validate all inputs
- ✅ Sanitize database queries
- ✅ Enable security headers
- ✅ Regular dependency updates

## 🚨 Troubleshooting

### Common Issues

**Backend won't start:**

- Check database credentials in `.env`
- Verify MySQL is running
- Check port availability (3001)

**Frontend can't connect to backend:**

- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS settings
- Ensure backend is running

**Database connection errors:**

- Verify MySQL credentials
- Check database exists
- Ensure user has proper permissions

**Build errors:**

- Clear `node_modules` and reinstall
- Check Node.js version (18+)
- Verify all environment variables

## 📞 Support

For support and questions:

- **Email**: support@astroforge.com
- **Documentation**: Check `docs/` folder
- **Issues**: Create GitHub issue

## 📄 License

This project is proprietary software owned by Astro Forge Holdings. All rights reserved.

**NO PERMISSION IS GRANTED** to use, copy, modify, merge, publish, distribute, sublicense, or sell copies of this software.

**UNAUTHORIZED USE, REPRODUCTION, OR DISTRIBUTION IS STRICTLY PROHIBITED.**

For licensing inquiries, contact: legal@astroforge.com
