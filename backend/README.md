# Royal Gambit Backend API

A Node.js/Express backend API for the Royal Gambit chess application.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **User Management**: Profile management, stats tracking, leaderboards
- **Game Statistics**: Track wins, losses, draws, ratings, and points
- **Chess News**: API endpoints for chess news and updates
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Validation**: Mongoose validation + validator.js

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and setup**:
   ```bash
   cd chess-backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/royal-gambit
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

4. **Verify installation**:
   Visit `http://localhost:5000/api/health`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update profile | Private |
| POST | `/change-password` | Change password | Private |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/me` | Get user profile | Private |
| PUT | `/me/stats` | Update game stats | Private |
| GET | `/me/games` | Get game history | Private |
| GET | `/leaderboard` | Get leaderboard | Public |
| GET | `/stats-summary` | Get overall stats | Public |
| GET | `/search` | Search users | Private |
| GET | `/:id` | Get user by ID | Public |
| DELETE | `/me` | Deactivate account | Private |

### News (`/api/news`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get news articles | Public |
| GET | `/:id` | Get single article | Public |
| GET | `/categories` | Get categories | Public |

## Data Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  stats: {
    gamesPlayed: Number,
    wins: Number,
    losses: Number,
    draws: Number,
    rating: Number,
    points: Number
  },
  preferences: {
    theme: String,
    soundEnabled: Boolean,
    showLegalMoves: Boolean
  },
  lastActive: Date,
  isActive: Boolean
}
```

### Game Model
```javascript
{
  players: {
    white: ObjectId,
    black: ObjectId
  },
  gameType: String,
  difficulty: String,
  status: String,
  result: {
    winner: String,
    reason: String
  },
  moves: Array,
  currentBoard: Array,
  timeControl: Object,
  pointsAwarded: Object
}
```

## Deployment

### Option 1: Railway

1. **Create Railway account**: [railway.app](https://railway.app)

2. **Deploy from GitHub**:
   - Connect your GitHub repository
   - Railway will auto-detect Node.js
   - Add environment variables in Railway dashboard

3. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

### Option 2: Heroku

1. **Install Heroku CLI**

2. **Deploy**:
   ```bash
   heroku create your-chess-backend
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-connection
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   git push heroku main
   ```

### Option 3: Render

1. **Create account**: [render.com](https://render.com)
2. **Connect GitHub repository**
3. **Configure**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

### MongoDB Setup

#### Option 1: MongoDB Atlas (Recommended)

1. **Create account**: [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create cluster** (free tier available)
3. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/royal-gambit?retryWrites=true&w=majority
   ```
4. **Whitelist IP addresses** (or use 0.0.0.0/0 for development)

#### Option 2: Local MongoDB

1. **Install MongoDB**: [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. **Start MongoDB**:
   ```bash
   mongod
   ```
3. **Connection string**:
   ```
   mongodb://localhost:27017/royal-gambit
   ```

## Frontend Integration

Update your frontend API configuration:

```javascript
// In your frontend .env file
VITE_API_URL=https://your-backend-url.railway.app/api

// Or for local development
VITE_API_URL=http://localhost:5000/api
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configured for your frontend domain
- **Helmet**: Security headers
- **Input Validation**: Mongoose + validator.js
- **Error Handling**: Comprehensive error responses

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start

# Test API endpoints
curl http://localhost:5000/api/health
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection | localhost |
| `JWT_SECRET` | JWT signing key | required |
| `JWT_EXPIRE` | Token expiration | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | localhost:3000 |

## Support

For issues and questions:
1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Check CORS configuration for frontend domain

## License

MIT License - see LICENSE file for details.