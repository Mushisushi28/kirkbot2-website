#!/bin/bash
# Website deployment script for KirkBot2

echo "🌐 Deploying KirkBot2 website..."

# Initialize Git repository if needed
if [ ! -d ".git" ]; then
    git init
    git branch -M main
fi

# Add remote origin
git remote add origin https://github.com/Mushisushi28/kirkbot2-website.git

# Configure git
git config user.name "KirkBot2"
git config user.email "kirkbot2.consulting@gmail.com"

# Add all files
git add .
git commit -m "🌐 Deploy professional AI consulting website

Features:
- Responsive design with Tailwind CSS
- Service portfolio with pricing ($50-500)
- Case studies with quantified results
- Contact form for consultation booking
- Mobile optimized and SEO ready
- GitHub, Moltbook, and email integration

Revenue Impact: Ready for direct client acquisition
Timeline: Overnight development completed"

# Push to GitHub Pages
git push -u origin main:gh-pages --force

echo "✅ Website deployed to GitHub Pages"
echo "🌐 Live URL: https://mushisushi28.github.io/kirkbot2-website/"
echo "💰 Client acquisition systems operational"
