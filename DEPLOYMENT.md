# LEGIT-ID Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the LEGIT-ID digital identity verification platform.

## Prerequisites
- Node.js 18+ and npm/pnpm installed
- Git repository access
- Supabase account and project
- Vercel account (for frontend deployment)
- Domain name (optional, for custom domain)

## Environment Setup

### 1. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Settings
VITE_APP_NAME=LEGIT-ID
VITE_APP_URL=https://your-domain.com

# Blockchain Configuration (Optional)
VITE_ETHEREUM_RPC_URL=your_ethereum_rpc_url
VITE_CONTRACT_ADDRESS=your_contract_address
```

### 2. Database Setup
1. Create a new Supabase project
2. Run the database migrations:
```bash
npm run db:migrate
```

3. Set up RLS (Row Level Security) policies for all tables
4. Configure authentication settings in Supabase dashboard

### 3. Storage Configuration
1. Set up Supabase storage buckets for document uploads
2. Configure storage policies for file access
3. Set up file size limits and allowed file types

## Development Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Local Production Test
```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Production Deployment

### Frontend Deployment (Vercel)

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Follow prompts to configure:
- Project name: legit-id
- Framework: Vite
- Build command: npm run build
- Output directory: dist
```

#### Option 2: Git Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

#### Option 3: Manual Deployment
```bash
# Build the application
npm run build

# Deploy dist folder to your hosting provider
# Upload contents of dist/ directory to your web server
```

### Backend Deployment (Supabase)

The backend is already handled by Supabase, but ensure:

1. **Database Migrations**: All migrations are applied
2. **Functions**: Deploy any Edge Functions
3. **Triggers**: Set up database triggers
4. **Webhooks**: Configure webhooks if needed

### Environment Configuration

#### Production Environment Variables
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Application
VITE_APP_NAME=LEGIT-ID
VITE_APP_URL=https://legit-id.vercel.app
VITE_ENVIRONMENT=production

# Security
VITE_SESSION_TIMEOUT=30
VITE_MAX_LOGIN_ATTEMPTS=5

# Blockchain (if enabled)
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
VITE_CONTRACT_ADDRESS=0x123...abc
```

## Domain Configuration

### Custom Domain Setup
1. Add custom domain in Vercel dashboard
2. Configure DNS records:
   - A record: `@` → `76.76.19.61`
   - CNAME record: `www` → `cname.vercel-dns.com`

### SSL Certificate
- Vercel automatically provisions SSL certificates
- Ensure HTTPS is enforced in application settings

## Security Configuration

### Content Security Policy
Add to your `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.supabase.io https://your-project.supabase.co;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### Security Headers
Configure in Vercel (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npm run analyze

# Optimize images
npm run optimize-images
```

### Caching Strategy
1. **Browser Caching**: Configure in Vercel
2. **CDN Caching**: Use Vercel's global CDN
3. **API Caching**: Configure Supabase query caching

### Monitoring
1. **Vercel Analytics**: Enable Web Analytics
2. **Supabase Monitoring**: Monitor database performance
3. **Error Tracking**: Set up Sentry or similar service

## Backup and Recovery

### Database Backups
- Supabase automatically creates daily backups
- Manual backups can be created via Supabase dashboard

### Code Backup
- Maintain Git repository with regular commits
- Use GitHub/GitLab for version control

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# Test after updates
npm run test
npm run build
```

### Log Monitoring
- Monitor Vercel deployment logs
- Check Supabase database logs
- Review application error logs

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify dependencies
   - Review build logs

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Review connection limits

3. **Authentication Problems**
   - Verify Supabase auth settings
   - Check email configuration
   - Review user permissions

### Support Resources
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Application Logs: Check Vercel dashboard

## Security Checklist

- [ ] Environment variables configured
- [ ] SSL certificate active
- [ ] Security headers configured
- [ ] CSP policy implemented
- [ ] Database access restricted
- [ ] API keys secured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error handling configured
- [ ] Regular security audits scheduled

## Performance Checklist

- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Caching configured
- [ ] CDN enabled
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] Performance monitoring active
- [ ] Regular performance audits scheduled

## Post-Deployment Verification

1. **Functionality Tests**
   - User registration/login
   - Identity creation
   - Document upload
   - Verification process
   - Admin panel access

2. **Performance Tests**
   - Page load times
   - API response times
   - Database query performance

3. **Security Tests**
   - Authentication flow
   - Authorization checks
   - Input validation
   - XSS protection

4. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers
   - Different screen sizes

## Contact Information

For deployment support:
- Email: support@legit-id.com
- Documentation: https://docs.legit-id.com
- Status Page: https://status.legit-id.com