# MovieMatch - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab Account**: Your code should be in a Git repository
3. **MongoDB Atlas**: Set up a MongoDB database
4. **TMDB API Key**: Get your API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
5. **Google OAuth**: Set up Google OAuth credentials

## Environment Variables Setup

Before deploying, you need to set up the following environment variables in Vercel:

### Required Environment Variables

1. **MONGO**: Your MongoDB connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/moviematch?retryWrites=true&w=majority
   ```

2. **NEXTAUTH_URL**: Your production URL (will be set automatically by Vercel)
   ```
   https://your-app-name.vercel.app
   ```

3. **NEXTAUTH_SECRET**: A random secret key for NextAuth
   ```
   openssl rand -base64 32
   ```

4. **GOOGLE_CLIENT_ID**: Your Google OAuth client ID
   ```
   your-google-client-id.apps.googleusercontent.com
   ```

5. **GOOGLE_CLIENT_SECRET**: Your Google OAuth client secret
   ```
   your-google-client-secret
   ```

6. **NEXT_PUBLIC_TMDB_BEARER_TOKEN**: Your TMDB API bearer token
   ```
   eyJhbGciOiJIUzI1NiJ9...
   ```

7. **TMDB_BEARER_TOKEN**: Your TMDB API bearer token (same as above)
   ```
   eyJhbGciOiJIUzI1NiJ9...
   ```

## Deployment Steps

### 1. Push to Git Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `my-app` (if your project is in a subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Set Environment Variables

1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add each environment variable listed above
3. Make sure to set them for "Production", "Preview", and "Development" environments

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Post-Deployment

### 1. Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add your production URL to authorized redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

### 2. Test Your Application

1. Visit your deployed URL
2. Test user authentication
3. Test movie search and recommendations
4. Test user profile features

## Troubleshooting

### Common Issues

1. **Build Failures**: Check the build logs in Vercel dashboard
2. **Environment Variables**: Ensure all variables are set correctly
3. **MongoDB Connection**: Verify your MongoDB connection string
4. **OAuth Issues**: Check redirect URIs in Google Console

### Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with production environment variables
4. Check MongoDB Atlas network access settings

## Local Development

To test with production environment variables locally:

1. Copy your production environment variables to a `.env.local` file
2. Update `NEXTAUTH_URL` to `http://localhost:3000`
3. Run `npm run dev`

## Performance Optimization

- Images are optimized using Next.js Image component
- API routes have 30-second timeout for TMDB requests
- MongoDB connection is cached for better performance 