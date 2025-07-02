#!/bin/bash

# Astro Forge Holdings - Deployment Script
# This script prepares and builds the project for deployment

set -e  # Exit on any error

echo "🚀 Starting Astro Forge Holdings deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Checking Node.js version..."
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

print_status "Checking npm version..."
NPM_VERSION=$(npm --version)
print_status "npm version: $NPM_VERSION"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Run linting and type checking
print_status "Running code quality checks..."
npm run lint
npm run type-check

# Build for production
print_status "Building for production..."
npm run build:prod

# Check if build was successful
if [ -d "dist" ]; then
    print_status "Build completed successfully!"
    print_status "Build size:"
    du -sh dist/
    
    print_status "Build contents:"
    ls -la dist/
    
    print_status "✅ Deployment build ready!"
    print_status "📁 Build output: ./dist/"
    print_status "🌐 Ready to deploy to your hosting provider"
else
    print_error "Build failed! dist/ directory not found."
    exit 1
fi

print_status "🎉 Deployment preparation completed successfully!" 