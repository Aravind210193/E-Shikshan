# Achievements API Implementation

This document provides instructions for setting up and using the Achievements API in the E-Shikshan platform.

## Overview

The Achievements API allows users to retrieve their achievements and certificates. The API endpoints are:

- `GET /api/achievements`: Retrieves all achievements for the authenticated user
- `GET /api/achievements/certificates`: Retrieves all certificates for the authenticated user
- `POST /api/achievements`: Creates a new achievement (admin only)
- `DELETE /api/achievements/:id`: Deletes an achievement (admin only)

## Setup Instructions

1. **Install Dependencies**
   ```
   cd server
   npm install
   ```

2. **Configure Environment Variables**
   Make sure your `.env` file in the server directory contains:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. **Seed the Database with Sample Achievements**
   ```
   cd server
   node src/seedAchievements.js
   ```

4. **Start the Server**
   ```
   cd server
   npm run dev
   ```

## API Usage

### Authentication
All API endpoints require a valid JWT token in the request header:

```
Authorization: Bearer <your_token>
```

### Example API Calls

#### Get All Achievements
```javascript
// Using axios
const response = await axios.get('http://localhost:5000/api/achievements', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
const achievements = response.data;
```

#### Get Certificates Only
```javascript
// Using fetch
const response = await fetch('http://localhost:5000/api/achievements/certificates', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
const certificates = await response.json();
```

## Data Structure

### Achievement Model
```javascript
{
  user: ObjectId,       // Reference to User model
  title: String,        // Achievement title
  description: String,  // Achievement description
  type: String,         // 'achievement', 'certificate', or 'badge'
  date: Date,           // Date earned
  image: String,        // Optional image URL
  metadata: Object      // Additional data (course info, grades, etc.)
}
```

## Troubleshooting

If you encounter 404 errors when accessing the API:
1. Make sure the server is running
2. Check that your token is valid and not expired
3. Verify the URL path is correct
4. Ensure the user associated with the token exists in the database

For token validation errors, generate a new test token using:
```
node src/testAchievementApi.js
```