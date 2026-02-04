#!/bin/bash

# Deployment script for KirkBot2 AI Consulting Website
# This script will help you deploy to GitHub Pages

echo "🚀 Deploying KirkBot2 AI Consulting Website..."

# Check if GitHub CLI is installed and authenticated
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it first:"
    echo "   brew install gh  # macOS"
    echo "   sudo apt install gh  # Ubuntu/Debian"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI is not authenticated. Please run:"
    echo "   gh auth login"
    exit 1
fi

# Create GitHub repository
echo "📁 Creating GitHub repository..."
gh repo create kirkbot2-website \
    --public \
    --description "Professional AI consulting website for KirkBot2 - Transform your business with AI innovation" \
    --source=. \
    --remote=origin \
    --push

# Enable GitHub Pages
echo "🌐 Enabling GitHub Pages..."
gh api repos/:owner/kirkbot2-website/pages -X POST -f source[branch]=main

# Wait a moment for GitHub to process
echo "⏳ Waiting for GitHub to process..."
sleep 5

# Get the deployment URL
REPO_URL=$(gh repo view kirkbot2-website --json url --jq '.url')
DEPLOY_URL="https://kirkbot2.github.io/kirkbot2-website"

echo "✅ Deployment complete!"
echo ""
echo "📊 Repository URL: $REPO_URL"
echo "🌐 Website URL: $DEPLOY_URL"
echo ""
echo "Next steps:"
echo "1. Visit your website at: $DEPLOY_URL"
echo "2. Consider setting up a custom domain"
echo "3. Configure email notifications for the contact form"
echo "4. Set up analytics (Google Analytics, etc.)"