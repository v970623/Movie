Movie Rental System

Overview

A full-stack movie rental application that includes user authentication, movie management, and rental tracking features.

Features

    •	User Authentication with role-based access control
    •	Movie Management (CRUD operations)
    •	External Movie Search via TMDB API
    •	Rental Management System
    •	Email Notifications for key events
    •	Admin Dashboard for monitoring and control

Tech Stack

    •	Backend: Node.js, Express, TypeScript, MongoDB
    •	Authentication: JWT, Passport
    •	Database: MongoDB with Mongoose
    •	API Integration: TMDB API

Setup and Installation

1. Clone the repository
   git clone <https://github.com/v970623/Movie.git>

2. Install dependencies

   cd backend
   npm install
   cd frontend
   npm install

3. Environment Configuration

Create a .env file in the backend directory:

    MAIL_HOST=your_mail_host
    MAIL_PORT=your_mail_port
    MAIL_USERNAME=your_mail_username
    MAIL_PASSWORD=your_mail_password
    MAIL_FROM=your_mail_from
    MAIL_TO=your_mail_to

    NODE_ENV=your_node_env

    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=your_google_callback_url

    JWT_SECRET=your_jwt_secret
    API_KEY=your_api_key

4. Database Initialization

   npm run init-db
   npm run init-movies

This command will populate the database with initial data, such as:{
"title": "The Shawshank Redemption",
"description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
"genre": ["Drama"],
"posterUrl": "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
"price": 4.99,
"status": "available"
}

5.API Routes

Movie Routes
| Method | Endpoint | Description |
|--------|--------------------|--------------------------|
| GET | /search | Search movies via TMDB |
| GET | /:id | Get movie by ID |
| GET | / | Get all movies |
| PUT | /:id | Update a movie |
| POST | /save-selected | Save selected movies |
| POST | /movie | Create a new movie |
| DELETE | /:id | Delete a movie |
| PUT | /:id/availability | Update movie availability |

Rental Routes

    | Method | Endpoint           | Description              |
    |--------|--------------------|--------------------------|
    | POST   | /                  | Create a new rental       |
    | GET    | /                  | Get rentals for a user   |
    | GET    | /admin             | Get all rentals for admin |
    | PUT    | /status            | Update rental status     |

6.Scripts

    | Command         | Description                        |
    |-----------------|------------------------------------|
    | npm run dev     | Start development server           |
    | npm run build   | Build the project                  |
    | npm run init-db     | Initialize database with sample data|
    | npm run init-movies | Initialize database with movie data |
    | npm test        | Run tests                          |
