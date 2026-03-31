# Production Reporting System - Deployment Guide

## Environment Variables

Create a `.env` file (or `.env.local` for local development):

```env
NEXT_PUBLIC_API_URL=https://raportti-api.pear-home.dedyn.io
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/tuotantoraportointi.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set Environment Variable:
     - `NEXT_PUBLIC_API_URL` = `https://raportti-api.pear-home.dedyn.io`
   - Deploy!

### Option 2: Docker

1. **Build the Docker image**
   ```bash
   docker build -t tuotantoraportointi .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_API_URL=https://raportti-api.pear-home.dedyn.io \
     tuotantoraportointi
   ```

### Option 3: Node.js Server

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Build for production**
   ```bash
   bun run build
   ```

3. **Start the server**
   ```bash
   NEXT_PUBLIC_API_URL=https://raportti-api.pear-home.dedyn.io bun run start
   ```

### Option 4: Static Export (for CDN hosting)

1. **Configure next.config.ts for static export**
   ```typescript
   const nextConfig = {
     output: 'export',
   }
   ```

2. **Build and export**
   ```bash
   bun run build
   ```

3. **Deploy the `out` folder** to any static hosting (Netlify, GitHub Pages, AWS S3, etc.)

## API Endpoints

All API calls go through: `https://raportti-api.pear-home.dedyn.io`

### Authentication
- `POST /auth/login` - Login (returns JWT token)

### Entries (Require Bearer Token)
- `GET /entries` - Get all entries
- `POST /entries/boiling` - Create boiling entry
- `POST /entries/packaging` - Create packaging entry
- `POST /entries/separation` - Create separation entry

### Reports (Require Bearer Token)
- `GET /reports/daily?date=YYYY-MM-DD` - Daily report
- `GET /reports/waste` - Waste report
- `GET /exports/csv?phase=boiling&from=YYYY-MM-DD&to=YYYY-MM-DD` - CSV export

## Testing the Deployment

1. Navigate to your deployed URL
2. Login with your credentials
3. Test each form:
   - Keitto (Boiling)
   - Pakkaus (Packaging)
   - Erotus (Separation)
4. Verify reports are working

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend API allows requests from your frontend domain.

### Authentication Issues
- Check that the JWT token is being stored correctly
- Verify the token is being sent in the `Authorization: Bearer <token>` header

### Build Errors
- Ensure all dependencies are installed: `bun install`
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `bun run build`
"# raporttisovellus" 
