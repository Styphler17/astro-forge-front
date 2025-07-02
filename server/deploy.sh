#!/bin/bash

# Astro Forge Backend Deployment Script
# This script sets up the backend for production deployment

echo "🚀 Starting Astro Forge Backend Deployment..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please create .env file with your production configuration"
    echo "💡 You can copy .env.example and update the values"
    exit 1
fi

# Test database connection
echo "🔍 Testing database connection..."
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Database connection successful');
    connection.release();
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });
"

if [ $? -eq 0 ]; then
    echo "✅ Database connection test passed"
else
    echo "❌ Database connection test failed"
    exit 1
fi

# Start the application
echo "🎯 Starting the application..."
if command -v pm2 &> /dev/null; then
    echo "📊 Using PM2 to start the application..."
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup
else
    echo "📊 Starting with Node.js directly..."
    npm start
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Your backend should now be running on port 3001"
echo "📊 API endpoints available at http://localhost:3001/api" 