#!/bin/bash

echo "🚀 Deploying Astro Forge Holdings..."

# Build the project
echo "📦 Building project..."
npm run build:prod

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files created in 'dist' folder"
    echo ""
    echo "🌐 Deployment options:"
    echo "1. Manual: Upload 'dist' folder to your hosting provider"
    echo ""
    echo "💡 For backend deployment, see DEPLOYMENT.md"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi 