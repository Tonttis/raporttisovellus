# Tuotantoraportointi - Deployment Guide

## Prerequisites

- Node.js 20+ or Bun runtime
- Access to the backend API: `https://raportti-api.pear-home.dedyn.io`
- Valid login credentials for the API

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL (required)
NEXT_PUBLIC_API_URL=https://raportti-api.pear-home.dedyn.io

# Database URL (if using local database features)
DATABASE_URL=file:./db/custom.db
```

---

## Option 1: Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Steps:

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables:
     - `NEXT_PUBLIC_API_URL` = `https://raportti-api.pear-home.dedyn.io`

3. **Deploy**
   - Vercel will automatically build and deploy
   - You'll get a URL like `https://your-app.vercel.app`

### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `reports.sinundomain.fi`)
3. Configure DNS records as instructed

---

## Option 2: Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://raportti-api.pear-home.dedyn.io \
  -t tuotantoraportointi .

# Run the container
docker run -p 3000:3000 tuotantoraportointi
```

### Using Docker Compose

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Docker with Reverse Proxy (nginx)

```nginx
server {
    listen 80;
    server_name reports.sinundomain.fi;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Option 3: Traditional VPS/Server Deployment

### 1. Install Dependencies

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or install Bun
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone and Build

```bash
# Clone your repository
git clone <your-repo-url>
cd tuotantoraportointi

# Install dependencies
bun install

# Build for production
bun run build
```

### 3. Run with PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start the application
pm2 start bun --name "tuotantoraportointi" -- run start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 4. Configure nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name reports.sinundomain.fi;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Enable HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d reports.sinundomain.fi

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Option 4: Static Export (if no server-side features needed)

If you want to deploy to a static hosting service:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  // Note: API routes won't work with static export
};
```

Then build and deploy the `out` folder.

---

## Testing the Deployment

### 1. Health Check

```bash
curl https://your-domain.fi
```

Should return the login page HTML.

### 2. API Connectivity Test

Open browser developer tools → Network tab → Login with credentials:
- Check for successful `POST /auth/login` response
- Verify JWT token is stored

### 3. Verify All Features

- [ ] Login works
- [ ] Dashboard loads entries
- [ ] Forms submit successfully
- [ ] Reports page shows data
- [ ] CSV export downloads file

---

## Troubleshooting

### CORS Issues

If you see CORS errors, ensure the backend API allows requests from your domain:
```
Access-Control-Allow-Origin: https://reports.sinundomain.fi
```

### API Connection Failed

1. Verify the API URL is correct
2. Check if the API is accessible from your server:
   ```bash
   curl https://raportti-api.pear-home.dedyn.io/health
   ```

### Environment Variables Not Applied

- Restart the server after changing `.env`
- For Docker, rebuild the image with new build args
- For Vercel, redeploy after changing environment variables

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
bun install
bun run build
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
pm2 monit
pm2 logs tuotantoraportointi
```

### Docker Logs

```bash
docker-compose logs -f frontend
```

### Vercel Logs

View logs in the Vercel dashboard under your project.

---

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit `.env` files
3. **JWT Storage**: Tokens are stored in sessionStorage (cleared on tab close)
4. **API Authentication**: All protected endpoints require Bearer token

---

## Quick Reference Commands

```bash
# Development
bun run dev

# Build
bun run build

# Start production server
bun run start

# Lint check
bun run lint

# Docker build
docker-compose up -d --build
```
