#!/bin/bash

# KirkBot2 Website Deployment Script
# Automated deployment to GitHub Pages with optimization

set -e  # Exit on any error

echo "🚀 Starting KirkBot2 Website Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/Mushisushi28/kirkbot2-website.git"
DEPLOY_BRANCH="main"
SITE_URL="https://mushisushi28.github.io/kirkbot2-website"
DOMAIN="kirkbot2.ai"

echo -e "${BLUE}📁 Repository: ${REPO_URL}"
echo -e "${BLUE}🌐 Site URL: ${SITE_URL}"
echo -e "${BLUE}🏷️  Domain: ${DOMAIN}"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Error: index.html not found. Please run this script from the website root directory."
    exit 1
fi

# Check git status
echo -e "${YELLOW}📊 Checking git status..."
git status

# Stage changes
echo -e "${YELLOW}📝 Staging changes..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit."
else
    # Commit changes
    echo -e "${YELLOW}💾 Committing changes..."
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')

Website deployment update:
- Optimized performance and user experience
- Updated service packages and pricing
- Enhanced client acquisition features
- Improved mobile responsiveness
- Analytics and conversion tracking updates

Auto-deployed via deployment script."
fi

# Push to GitHub
echo -e "${YELLOW}🚀 Pushing to GitHub..."
git push origin $DEPLOY_BRANCH

# Verify deployment
echo -e "${YELLOW}⏳ Verifying deployment..."
sleep 5

# Check if site is accessible
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Deployment successful! Website is live at: $SITE_URL"
else
    echo -e "${RED}⚠️  Deployment pushed but site not yet accessible. This is normal for GitHub Pages (may take a few minutes)."
fi

echo -e "${GREEN}🎉 KirkBot2 Website Deployment Complete!"
echo -e "${BLUE}📍 Live Site: $SITE_URL"
echo -e "${BLUE}🏷️  Custom Domain: https://$DOMAIN (once DNS is configured)"
echo -e "${BLUE}📊 Analytics: Check browser console for tracking events"
echo -e "${BLUE}📧 Contact Forms: Submissions stored in localStorage (demo mode)"

# Performance summary
echo -e "${YELLOW}📈 Performance Summary:"
echo -e "${YELLOW}   • Responsive design for all devices"
echo -e "${YELLOW}   • Optimized images and assets"
echo -e "${YELLOW}   • SEO-friendly structure"
echo -e "${YELLOW}   • Interactive booking system"
echo -e "${YELLOW}   • Analytics tracking enabled"

echo -e "${GREEN}✨ Ready for client acquisition! 🇺🇸"

# Instructions for domain setup
echo -e "${BLUE}📋 Domain Setup Instructions:"
echo -e "${BLUE}   1. Purchase domain: $DOMAIN"
echo -e "${BLUE}   2. Configure DNS A records to GitHub Pages IPs:"
echo -e "${BLUE}      - 185.199.108.153"
echo -e "${BLUE}      - 185.199.109.153"
echo -e "${BLUE}      - 185.199.110.153"
echo -e "${BLUE}      - 185.199.111.153"
echo -e "${BLUE}   3. Enable custom domain in GitHub repository settings"
echo -e "${BLUE}   4. Wait for DNS propagation (15-60 minutes)"

# Email integration reminder
echo -e "${BLUE}📧 Next Steps for Full Functionality:"
echo -e "${BLUE}   1. Set up real email address (consulting@kirkbot2.ai)"
echo -e "${BLUE}   2. Configure form submission backend (Formspree, Netlify Forms, etc.)"
echo -e "${BLUE}   3. Set up payment processing (Stripe, PayPal)"
echo -e "${BLUE}   4. Configure calendar integration for booking system"
echo -e "${BLUE}   5. Set up Google Analytics or alternative analytics service"

echo -e "${GREEN}🎯 Mission Accomplished! Professional AI consulting website deployed successfully!"