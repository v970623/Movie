# Movie

## Detailed Installation Guide

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Google Cloud Console account
- SMTP email service account

### Step-by-Step Setup

1. Clone the repository

```bash
git clone <https://github.com/v970623/Movie.git>
cd Movie
```

2. Install dependencies for both frontend and backend

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Variables Configuration

Create `.env` files in both backend and frontend directories:

**Backend (.env)**:

```plaintext
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/movie

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

**Frontend (.env)**:

```plaintext
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## Project Structure

```plaintext
Movie/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── index.ts         # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Root component
│   └── package.json
```

## API Documentation

### Authentication Endpoints

```plaintext
POST /api/auth/register
- Register new user
- Body: { email, password, name }

POST /api/auth/login
- Login with email/password
- Body: { email, password }

GET /api/auth/google
- Initiate Google OAuth flow

GET /api/auth/google/callback
- Google OAuth callback handler
```

### Application Endpoints

```plaintext
POST /api/applications
- Submit new application
- Auth required
- Body: { hallName, capacity, facilities, preferredDates }

GET /api/applications
- Get all applications (staff only)
- Auth required

GET /api/applications/:id
- Get specific application
- Auth required

PATCH /api/applications/:id
- Update application status
- Staff auth required
- Body: { status, comments }
```

### User Endpoints

```plaintext
GET /api/users/profile
- Get current user profile
- Auth required

PATCH /api/users/profile
- Update user profile
- Auth required
- Body: { name, phone, organization }
```

## Development

1. Start MongoDB service

2. Start backend server:

```bash
cd backend
npm run dev
```

3. Start frontend development server:

```bash
cd frontend
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Production Deployment

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Build the backend:

```bash
cd backend
npm run build
```

3. Set environment variables for production

4. Start the production server:

```bash
cd backend
npm start
```

## Security Considerations

- All API endpoints (except auth) require JWT authentication
- Passwords are hashed using bcrypt
- CORS is configured for security
- Rate limiting is implemented on auth routes
- Input validation using express-validator
