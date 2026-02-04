# Deployment Guide for KirkBot2 AI Consulting Website

## Quick Deployment

### Option 1: Using GitHub CLI (Recommended)

1. **Install GitHub CLI** (if not already installed):
   ```bash
   # macOS
   brew install gh
   
   # Ubuntu/Debian
   sudo apt install gh
   
   # Windows
   # Download from https://cli.github.com/
   ```

2. **Authenticate with GitHub**:
   ```bash
   gh auth login
   ```

3. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

### Option 2: Manual Deployment

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `kirkbot2-website`
   - Set as Public
   - Add README (optional)

2. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/kirkbot2-website.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Click Save

4. **Wait for deployment** (typically 1-2 minutes)
   - Your site will be available at: `https://YOUR_USERNAME.github.io/kirkbot2-website`

## Custom Domain Setup

### Option 1: Use kirkbot2.com (Already Configured)

The `CNAME` file is already set up for `kirkbot2.com`. To complete the setup:

1. **Point your domain to GitHub Pages**:
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add DNS records:
     ```
     Type: CNAME
     Name: @ (or your domain name)
     Value: kirkbot2.github.io
     TTL: 3600
     ```
   - Add WWW record:
     ```
     Type: CNAME
     Name: www
     Value: kirkbot2.github.io
     TTL: 3600
     ```

2. **Update GitHub Pages settings**:
   - Go to repository Settings > Pages
   - Under "Custom domain", enter: `kirkbot2.com`
   - Check "Enforce HTTPS"

### Option 2: Use a Different Domain

1. **Update CNAME file**:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Update custom domain"
   git push
   ```

2. **Follow the DNS setup steps above** with your domain.

## Email Integration for Contact Form

### Option 1: Formspree (Easy)

1. Sign up at https://formspree.io
2. Create a new form
3. Update the form action in index.html:
   ```html
   <form id="contactForm" action="https://formspree.io/f/your-form-id" method="POST">
   ```

### Option 2: Netlify Forms

If you deploy to Netlify instead of GitHub Pages:

1. Add `data-netlify="true"` to the form
2. Netlify will handle form submissions automatically

### Option 3: Custom Backend

Create a simple backend service using:
- Node.js + Express
- Serverless functions (AWS Lambda, Vercel, etc.)
- Third-party services like SendGrid, Mailgun

## Analytics Setup

### Google Analytics

1. Create a Google Analytics account
2. Get your tracking ID (GA4)
3. Add to index.html before `</head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_TRACKING_ID');
   </script>
   ```

### Alternative Analytics

- Plausible (privacy-focused)
- Fathom (simple analytics)
- Umami (open-source)

## Performance Optimization

### Image Optimization

- Use WebP format for images
- Implement lazy loading
- Compress images before upload

### Caching

- GitHub Pages automatically handles caching
- Consider Cloudflare for advanced caching rules

### Monitoring

- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## Security Considerations

- HTTPS is automatically enabled by GitHub Pages
- Form submissions should be validated server-side
- Consider implementing rate limiting for forms
- Keep dependencies updated

## Maintenance

### Regular Updates

- Update content quarterly
- Check for broken links monthly
- Review SEO performance
- Update case studies with new results

### Backup Strategy

- All code is version controlled in Git
- Regular commits ensure no data loss
- Consider exporting contact form submissions

## Troubleshooting

### Common Issues

1. **Site not loading**:
   - Check GitHub Pages deployment status
   - Verify DNS propagation
   - Clear browser cache

2. **Custom domain not working**:
   - Verify DNS records
   - Check GitHub Pages custom domain settings
   - Wait up to 48 hours for DNS propagation

3. **Contact form not working**:
   - Check form backend integration
   - Verify CORS settings
   - Test form validation

### Deployment Status

Check deployment status at:
- GitHub repository > Actions
- GitHub Pages: `https://github.com/username/repo/pages`

## Next Steps

1. **Set up professional email**: `contact@kirkbot2.com`
2. **Implement actual contact form backend**
3. **Add client logos and testimonials**
4. **Create blog section for thought leadership**
5. **Set up CRM integration for lead tracking**
6. **Add social media integration**
7. **Implement A/B testing for conversion optimization**

## Support

For issues with:
- GitHub Pages: https://docs.github.com/en/pages
- DNS issues: Contact your domain registrar
- Form integration: Check service documentation

---

**Your professional AI consulting website is now ready for deployment!**