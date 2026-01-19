# Deploy to Render - Step by Step

## Prerequisites
1. GitHub account with your backend code
2. MongoDB Atlas account (free tier)
3. Render account (free tier available)

## Step 1: Setup MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user:
   - Database Access → Add New Database User
   - Username: `chessuser`
   - Password: Generate a secure password
4. Whitelist IP addresses:
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere)
5. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://chessuser:yourpassword@cluster0.xxxxx.mongodb.net/royal-gambit?retryWrites=true&w=majority`

## Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login** with GitHub
3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository with your backend code

4. **Configure the service**:
   ```
   Name: royal-gambit-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: chess-backend (if backend is in subfolder)
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables**:
   Click "Advanced" and add these environment variables:
   
   ```
   NODE_ENV = production
   MONGODB_URI = your-mongodb-atlas-connection-string
   JWT_SECRET = your-super-secret-jwt-key-make-it-long-and-random
   JWT_EXPIRE = 7d
   FRONTEND_URL = https://your-vercel-app.vercel.app
   ```

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (usually 2-5 minutes)
   - Your backend will be available at: `https://your-service-name.onrender.com`

## Step 3: Test Your Backend

1. **Health Check**:
   ```bash
   curl https://your-service-name.onrender.com/api/health
   ```
   Should return: `{"status":"OK","timestamp":"...","uptime":...}`

2. **Test Registration**:
   ```bash
   curl -X POST https://your-service-name.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
   ```

## Step 4: Update Frontend

1. **Create/Update `.env` file** in your frontend project:
   ```env
   VITE_API_URL=https://your-service-name.onrender.com/api
   ```

2. **Deploy frontend to Vercel**:
   ```bash
   vercel --prod
   ```

3. **Update CORS settings**:
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the service

## Troubleshooting

### Common Issues:

1. **"Missing script: start"**:
   - Make sure `package.json` has: `"start": "node server.js"`

2. **MongoDB connection failed**:
   - Check MongoDB Atlas connection string
   - Verify database user credentials
   - Ensure IP whitelist includes `0.0.0.0/0`

3. **CORS errors**:
   - Update `FRONTEND_URL` environment variable
   - Redeploy the service

4. **Environment variables not working**:
   - Check spelling and values in Render dashboard
   - Redeploy after making changes

### Render Free Tier Limitations:
- Service spins down after 15 minutes of inactivity
- First request after spin-down may be slow (cold start)
- 750 hours/month free (enough for development)

## Monitoring

1. **Render Dashboard**:
   - View logs in real-time
   - Monitor resource usage
   - Check deployment status

2. **Health Check Endpoint**:
   - `GET /api/health` - Check if service is running
   - Returns uptime, environment, and timestamp

## Production Considerations

For production use, consider:
1. **Paid Render plan** for better performance
2. **MongoDB Atlas paid tier** for better performance
3. **Custom domain** for your API
4. **SSL certificate** (automatic with Render)
5. **Monitoring and alerting** setup

## Support

If you encounter issues:
1. Check Render logs in the dashboard
2. Verify all environment variables are set correctly
3. Test MongoDB connection separately
4. Check GitHub repository has all required files