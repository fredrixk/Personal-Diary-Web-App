# Personal Diary Web App

A full-stack web application for personal diary entries with mood tracking and analytics. Built with React.js for the frontend and Node.js/Express with MongoDB for the backend.

## Features

- 🔐 User authentication (register/login) with JWT
- 📝 Create, read, update, and delete diary entries
- 😊 Mood tracking (Very Happy, Happy, Neutral, Sad, Very Sad)
- 📊 Analytics dashboard with mood trends and statistics
- 🏷️ Tag support for diary entries
- 📅 Date-based entry organization

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- CSS3 for styling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/personal-diary
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional, defaults to localhost:5000):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Register a new account or login with existing credentials
2. Create your first diary entry from the Dashboard
3. Track your mood for each entry
4. View all your entries in the Entries page
5. Check your mood trends and statistics in the Analytics page

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Diary Entries
- `GET /api/entries` - Get all entries for authenticated user
- `GET /api/entries/:id` - Get single entry
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### Analytics
- `GET /api/analytics/stats` - Get entry statistics
- `GET /api/analytics/mood-distribution` - Get mood distribution
- `GET /api/analytics/mood-trends?days=30` - Get mood trends over time

## Project Structure

```
Personal Diary Web App/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── DiaryEntry.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── entries.js
│   │   └── analytics.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Deployment

### Render Deployment

This app is configured for easy deployment on Render. See [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) for detailed deployment instructions.

**Quick Deploy:**
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Add MongoDB database in Render (or use Atlas)
5. Set environment variables:
   - `MONGODB_URI` (from MongoDB service)
   - `JWT_SECRET` (generate a random secret)
   - `NODE_ENV=production`
   - `PORT=10000`
6. Render will automatically build and deploy your app

The app is configured to:
- Build the React frontend during deployment
- Serve static files from the backend in production
- Use relative API URLs for seamless integration
- Work with Render's free tier

## License

ISC

