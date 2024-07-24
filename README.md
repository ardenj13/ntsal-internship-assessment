# URL Shortener Project

This project is a URL shortener application with a Node.js backend server and a React frontend. The backend is located in the `/backend` folder, and the React app is in the `/shorten-url-web-app` folder.

## Demo

You can see a live demo of this project at: [Demo Link](https://www.loom.com/share/7621eefbced944df9a60029b99a7d37f?sid=5525babb-6a70-4607-ac14-4976dbd2d293)

## Project Structure

```
/
├── backend/
│   ├── functions/
│   │   └── general.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── shorten-url-web-app/
    ├── public/
    ├── src/
    ├── package.json
    └── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the `/backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `/backend` directory and add the following:
   ```
   PORT=8080
   PRODUCTION_DATABASE=your_mongodb_connection_string
   TEST_DATABASE=your_mongodb_connection_string
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the `/shorten-url-web-app` directory:
   ```
   cd shorten-url-web-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React app:
   ```
   npm start
   ```

## API Endpoints

### 1. Shorten URL
- **URL:** `/shorten`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **Success Response:**
  ```json
  {
    "originalUrl": "https://example.com",
    "shortUrl": "http://localhost:8080/abcde"
  }
  ```
- **Error Response:**
  ```json
  {
    "error": "Invalid URL"
  }
  ```

### 2. Redirect to Original URL
- **URL:** `/:id`
- **Method:** `GET`
- **Success Response:** Redirects to the original URL
- **Error Response:**
  ```json
  {
    "error": "URL not found"
  }
  ```

### 3. Fetch All URLs
- **URL:** `/fetch/urls`
- **Method:** `GET`
- **Success Response:**
  ```json
  [
    {
      "url": "https://example.com",
      "short": "abcde",
      "views": 5
    },
    ...
  ]
  ```

### 4. Update URL
- **URL:** `/:id`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "url": "https://newexample.com"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": "URL updated successfully",
    "updatedUrl": {
      "url": "https://newexample.com",
      "short": "abcde",
      "views": 5
    }
  }
  ```
- **Error Response:**
  ```json
  {
    "error": "Shortened ID not found"
  }
  ```

### 5. Delete URL
- **URL:** `/:id`
- **Method:** `DELETE`
- **Success Response:**
  ```json
  {
    "message": "URL deleted successfully",
    "deletedUrl": {
      "url": "https://example.com",
      "short": "abcde",
      "views": 5
    }
  }
  ```
- **Error Response:**
  ```json
  {
    "error": "Shortened ID not found"
  }
  ```

## Additional Notes

- The backend uses MongoDB for data storage. Ensure you have MongoDB installed and running, or provide a valid MongoDB Atlas connection string in the `.env` file.
- CORS is enabled for all origins in the backend, which may need to be restricted in a production environment.
- Error handling and input validation are implemented for most endpoints.

For more detailed information about the project, please refer to the source code and comments within each file.