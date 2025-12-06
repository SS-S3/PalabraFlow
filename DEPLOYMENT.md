# PalabraFlow Deployment Guide

## 🚀 Deployment Instructions

This project has TWO deployment options:

### **Option 1: Deploy Backend to Render (Recommended)**

#### Backend Deployment (Python + Node.js):

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New" → "Web Service"
   - Connect your `PalabraFlow` repository
   - Render will automatically detect the `render.yaml` file
   - Click "Apply" to deploy
   
3. **Get your deployed URL:**
   - After deployment, you'll get a URL like: `https://palabraflow.onrender.com`
   - Note: First load may take 2-3 minutes as the model loads

#### Frontend Deployment (GitHub Pages):

1. **Update the API endpoint in your code:**
   - Edit `client/src/components/TranslationPanel.jsx`
   - Change the fetch URL to your Render URL

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

3. **Access your site:**
   - Visit: `https://ss-s3.github.io/PalabraFlow`

---

### **Option 2: Full Python Deployment (Simpler)**

Use the combined `app.py` which serves both frontend and backend:

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Deploy to Render:**
   - The `render.yaml` is already configured
   - Push to GitHub and connect to Render
   - Single service handles everything

3. **Access:**
   - Your app will be at: `https://palabraflow.onrender.com`

---

## 📝 Important Notes

### For Production:
- **Environment Variables:** The backend uses `PORT` from environment (default: 10000 for Render)
- **CORS:** Already configured in both `server.js` and `translator.py`
- **Build:** GitHub Pages deployment script is in root `package.json`

### Free Tier Limitations:
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~50 seconds (model loading)
- Consider using a keep-alive service or upgrading for production

### Local Development:
- Frontend: `http://localhost:3000`
- Node.js Server: `http://localhost:5001`  
- Python Service: `http://localhost:5002`

---

## 🔧 Quick Commands

```bash
# Install all dependencies
npm run install-all

# Run development (all services)
npm run dev

# Build for production
npm run build

# Deploy frontend to GitHub Pages
npm run deploy
```

## 🌐 Live URLs (After Deployment)

- **Frontend (GitHub Pages):** https://ss-s3.github.io/PalabraFlow
- **Backend (Render):** https://palabraflow.onrender.com
- **API Health Check:** https://palabraflow.onrender.com/api/health
