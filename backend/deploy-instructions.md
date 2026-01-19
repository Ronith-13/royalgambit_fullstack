# Quick Fix for Render Deployment

## Option 1: Separate Repository (Recommended)

1. **Create a new GitHub repository** called `royal-gambit-backend`

2. **Copy all files from chess-backend folder** to the new repository root:
   ```
   royal-gambit-backend/
   ├── package.json
   ├── server.js
   ├── .env.example
   ├── models/
   ├── routes/
   ├── middleware/
   └── README.md
   ```

3. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial backend setup"
   git remote add origin https://github.com/yourusername/royal-gambit-backend.git
   git push -u origin main
   ```

4. **Deploy to Render**:
   - Use the new repository
   - Leave Root Directory empty
   - Build Command: `npm install`
   - Start Command: `npm start`

## Option 2: Fix Current Repository

If you want to keep everything in one repo:

1. **In Render service settings**:
   - Set **Root Directory** to: `chess-backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **If that doesn't work, try**:
   - Root Directory: `./chess-backend`
   - Or check your exact folder structure

## Option 3: Move Files to Root

Move all backend files to your repository root:
```
your-repo/
├── package.json          <- Backend package.json
├── server.js             <- Backend server
├── models/
├── routes/
├── middleware/
├── Royal_Gambit/         <- Frontend in subfolder
└── README.md
```

Then in Render:
- Root Directory: (leave empty)
- Build Command: `npm install`
- Start Command: `npm start`