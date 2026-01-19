# Vercel Frontend Deployment (with Render Backend)

## Frontend Deployment on Vercel

### Steps:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. **Important:** Set the root directory to `frontend`
5. Vercel will auto-detect it's a Vite project
6. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL

### Environment Variables

#### Frontend (.env.production)
```
VITE_API_URL=https://royalgambit-fullstack.onrender.com
```

#### Update Your Render Backend
Make sure your Render backend environment includes:
```
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
NODE_ENV=production
```

### Quick Deployment Checklist:
- [ ] Backend deployed on Render ✅
- [ ] Update `frontend/.env.production` with your Render backend URL
- [ ] Deploy frontend on Vercel with root directory set to `frontend`
- [ ] Update Render backend's `FRONTEND_URL` with your Vercel URL
- [ ] Test the connection between frontend and backend

### Local Development:
- Backend: Your Render URL
- Frontend: http://localhost:5173

### Troubleshooting:
- Ensure CORS is configured to allow your Vercel domain
- Check that your Render backend is accessible
- Verify environment variables are set correctly