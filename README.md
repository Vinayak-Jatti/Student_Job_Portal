# Placement Portal - Production Ready

A comprehensive placement management system for educational institutions. This portal enables students, HODs, and TPOs to manage placement drives, applications, and student profiles efficiently.

## 🚀 Features

### Student Features
- 📊 Dashboard with drive statistics
- 👤 Complete profile management
- 📄 Resume builder with multiple templates
- 💼 Browse and apply to placement drives
- 📝 Track application status
- 📋 View recruitment rounds and updates

### HOD Features
- ✅ Approve/reject student profiles
- 📊 Department statistics and reports
- 📈 View all drives and applications
- 📋 Export reports to Excel

### TPO Features
- 💼 Create and manage placement drives
- 📝 Manage applications and status
- 👥 View all students
- 📊 Comprehensive reports and analytics
- 📋 Export data to Excel
- 🔄 Manage recruitment rounds

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Axios** - API calls

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Nodemailer** - Email notifications

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/placement_portal
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_change_in_production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Production Build

### Backend

1. Set environment variables for production:
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_secret_key
FRONTEND_URL=https://yourdomain.com
```

2. Start the server:
```bash
npm start
```

### Frontend

1. Build for production:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

3. The build output will be in the `dist` directory, ready to be deployed to any static hosting service.

## 🚢 Deployment

### Backend Deployment (Recommended: Railway, Render, or Heroku)

1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Upload backend code
4. Start the server

### Frontend Deployment (Recommended: Vercel, Netlify, or Cloudflare Pages)

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables:
   - `VITE_API_URL`: Your backend API URL

### Full Stack Deployment (Recommended: DigitalOcean, AWS, or Azure)

1. Set up a server (Ubuntu recommended)
2. Install Node.js and MongoDB
3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start backend/server.js --name "placement-api"
```
4. Use Nginx as reverse proxy
5. Deploy frontend build to Nginx or CDN

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop (1024px and up)
- 🖥️ Large screens (1280px and up)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- File upload restrictions
- Role-based access control
- Secure API endpoints

## 📋 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Student Routes
- `GET /api/students/me` - Get student profile
- `PUT /api/students/me` - Update student profile
- `POST /api/students/me/resume` - Upload resume

### Drive Routes
- `GET /api/drives` - Get all drives
- `POST /api/drives` - Create drive (TPO only)
- `PUT /api/drives/:id` - Update drive (TPO only)
- `DELETE /api/drives/:id` - Delete drive (TPO only)

### Application Routes
- `GET /api/applications/my-applications` - Get student applications
- `GET /api/applications/drive/:driveId` - Get drive applications (TPO)
- `POST /api/applications` - Apply to drive
- `PUT /api/applications/:id/status` - Update application status (TPO)

### Reports Routes
- `GET /api/reports/department` - Get department reports (HOD)
- `GET /api/reports/drive/:driveId` - Get drive reports (TPO)
- `GET /api/reports/export/excel` - Export reports to Excel

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `JWT_SECRET` - JWT secret key
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_ENV` - Environment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Team
- Express.js Team
- MongoDB Team
- Tailwind CSS Team

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Real-time updates
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Integration with job portals
- [ ] Automated resume parsing
- [ ] Interview scheduling
- [ ] Video interview support

## 🔄 Version History

- **v1.0.0** - Initial production release
  - Complete student, HOD, and TPO features
  - Responsive design
  - Production-ready configuration
  - Comprehensive error handling

---

**Made with ❤️ for educational institutions**

