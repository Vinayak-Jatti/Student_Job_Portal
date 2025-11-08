# Placement Portal - Setup Guide

This guide will help you set up both the backend and frontend, and connect them to a local MongoDB database.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn package manager

## Step 1: Install MongoDB (if not already installed)

### Option A: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017` by default

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

## Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
# Server Configuration
PORT=5000

# MongoDB Connection
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/placement_portal

# For MongoDB Atlas (replace with your connection string):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/placement_portal?retryWrites=true&w=majority

# JWT Secret Key (Change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Email Configuration (Optional - for sending notifications)
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
Server running on port 5000
```

## Step 3: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Step 4: Verify the Connection

1. **Backend is running**: Check `http://localhost:5000` - you should see "wellcome to home page"

2. **Database connection**: Check the backend console for "✅ MongoDB connected"

3. **Frontend connection**: 
   - Open `http://localhost:5173`
   - Try registering a new user
   - Try logging in
   - The frontend should successfully communicate with the backend

## Step 5: Create Your First User

1. Go to the registration page: `http://localhost:5173/register`
2. Fill in the form:
   - Name: Your name
   - Email: Your email
   - Role: Select (Student, HOD, or TPO)
   - Password: Choose a password
3. Click "Create Account"
4. You'll be redirected to login
5. Login with your credentials
6. You'll be redirected to your role-specific dashboard

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoDB connection error"**
- Make sure MongoDB is running: `mongodb://localhost:27017`
- Check your `.env` file has the correct `MONGO_URI`
- For MongoDB Atlas, ensure your IP is whitelisted

**Error: "MONGO_URI not set in .env"**
- Make sure you created the `.env` file in the `backend` directory
- Check that `MONGO_URI` is spelled correctly

### Backend Issues

**Error: "Cannot find module"**
- Run `npm install` in the backend directory
- Make sure all dependencies are installed

**Port already in use**
- Change the `PORT` in `.env` to a different port (e.g., 5001)
- Update `VITE_API_URL` in frontend `.env` accordingly

### Frontend Issues

**Error: "Network Error" or "CORS Error"**
- Make sure the backend is running on port 5000
- Check that `VITE_API_URL` in frontend `.env` matches your backend URL
- Verify CORS is configured in `backend/server.js`

**Error: "401 Unauthorized"**
- Make sure you're logged in
- Check that the token is being stored in localStorage
- Try logging out and logging back in

### Database Issues

**No data showing**
- Make sure MongoDB is running
- Check that the database `placement_portal` exists
- Verify your connection string is correct

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Placement Drives
- `GET /api/drives` - Get all drives (requires auth)
- `POST /api/drives` - Create a drive (TPO only)
- `PUT /api/drives/:id` - Update a drive (TPO only)
- `DELETE /api/drives/:id` - Delete a drive (TPO only)

### Dashboards
- `GET /api/dashboard/student` - Student dashboard
- `GET /api/dashboard/hod` - HOD dashboard
- `GET /api/dashboard/tpo` - TPO dashboard

## Development Tips

1. **Backend logs**: Check the console for API requests and errors
2. **Frontend logs**: Open browser DevTools (F12) to see network requests
3. **Database inspection**: Use MongoDB Compass or mongo shell to view your data
4. **Hot reload**: Both frontend and backend support auto-reload during development

## Production Deployment

For production:
1. Change `JWT_SECRET` to a strong, random string
2. Set proper CORS origins
3. Use environment variables for all sensitive data
4. Enable HTTPS
5. Use a production MongoDB instance

## Support

If you encounter any issues:
1. Check the console logs (both backend and browser)
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed

