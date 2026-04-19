# 🎬 MovieMatch

A personalized movie recommendation platform that helps you discover your next favorite film based on your preferences and viewing history.

## 🌟 Features

- **Google OAuth Authentication** - Secure login with your Google account
- **Movie Discovery** - Browse and search from thousands of movies using the TMDB API
- **Smart Recommendations** - Get personalized movie suggestions based on your watched and liked movies
- **Watchlist Management** - Keep track of movies you want to watch
- **Watch History** - Maintain a history of movies you've already watched
- **Liked Movies** - Bookmark your favorite movies for quick reference
- **Search Functionality** - Easily find movies by title
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15+ (React framework)
- TypeScript
- Tailwind CSS (styling)
- Next-Auth (authentication)

**Backend:**
- Next.js API Routes
- MongoDB (database)
- NextAuth.js (authentication provider)
- TMDB API (movie data)

**Deployment:**
- Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following:
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB account (MongoDB Atlas)
- Google OAuth credentials
- TMDB API key

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/kartik7454/MovieMatch.git
cd MovieMatch
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# MongoDB
MONGO=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# TMDB API
NEXT_PUBLIC_TMDB_BEARER_TOKEN=your_tmdb_bearer_token
TMDB_BEARER_TOKEN=your_tmdb_bearer_token
```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 5. Start Using MovieMatch
1. Sign in with your Google account
2. Browse and select movies you've watched
3. Mark movies as liked
4. Get personalized recommendations
5. Add movies to your watchlist

## 📚 Project Structure

```
MovieMatch/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   └── Providers.tsx     # Next-Auth providers
│   ├── components/
│   │   ├── navbar.jsx        # Navigation bar
│   │   ├── SignIn.tsx        # Sign in component
│   │   └── ...               # Other components
│   └── ...
├── public/
│   └── favicon.ico
├── .env.local               # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🌐 Getting API Keys

### TMDB API Key
1. Visit [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Create an account or log in
3. Go to API section and request an API key
4. Copy your API key and bearer token

### Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (local development)
   - https://your-deployed-url.vercel.app/api/auth/callback/google (production)
6. Copy your Client ID and Client Secret

### MongoDB Connection String
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Replace username and password with your credentials

## 📦 Building for Production
```bash
npm run build
npm start
```

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

The easiest way to deploy is using [Vercel](https://vercel.com/):
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

**Live Demo**: [https://movie-match-lyart.vercel.app](https://movie-match-lyart.vercel.app)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to:
- Follow the existing code style
- Write clear commit messages
- Update documentation as needed
- Test your changes before submitting

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support & Troubleshooting

### Common Issues

**Port 3000 is already in use**
```bash
npm run dev -- -p 3001
```

**MongoDB connection error**
- Verify your MongoDB connection string
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure MONGO environment variable is correctly set

**Google OAuth not working**
- Verify redirect URIs match your deployment URL
- Check that Client ID and Secret are correct
- Clear browser cookies and try again

For more issues, check [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

## 📧 Contact & Feedback

Have questions or suggestions? Feel free to:
- Open an issue on GitHub
- Contact the maintainer: [@kartik7454](https://github.com/kartik7454)

---

**Happy movie matching! 🎬🍿**