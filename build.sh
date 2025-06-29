#!/bin/bash

echo "🚀 Starting build process..."

# Install dependencies with platform-specific handling
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Force install the missing Rollup dependency for Linux
echo "🔧 Installing Rollup Linux dependency..."
npm install @rollup/rollup-linux-x64-gnu@4.6.1 --no-save --force

# Build the project
echo "🏗️ Building project..."
npm run build:prod

echo "✅ Build completed!" 