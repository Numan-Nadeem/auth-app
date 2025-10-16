# MERN Auth Boilerplate

![License](https://img.shields.io/badge/License-ISC-blue.svg)

This project serves as a boilerplate for a full-stack MERN application, implementing a secure JWT-based authentication system. It uses short-lived access tokens for API authorization and long-lived refresh tokens, stored in `httpOnly` cookies, to provide a seamless and secure user session.

## How It Works

The authentication flow is designed to be secure and efficient:

1.  **User Login**: The user submits their credentials (email/password).
2.  **Token Generation**: The backend verifies the credentials and generates two tokens:
    - An **Access Token** (short-lived JWT) which is sent back in the JSON response.
    - A **Refresh Token** (long-lived JWT) which is stored in a secure, `httpOnly` cookie.
3.  **Authenticated Requests**: The React frontend stores the access token in memory and includes it in the `Authorization` header for all requests to protected API routes.
4.  **Token Expiration & Refresh**:
    - When the access token expires, the backend sends a `401 Unauthorized` response.
    - An Axios interceptor on the frontend catches this response, automatically makes a request to the `/api/v1/auth/refresh` endpoint (sending the refresh token via the cookie).
    - The backend validates the refresh token and issues a new access token.
    - The original failed request is transparently retried with the new access token.
5.  **Logout**: The refresh token is cleared from the backend and the cookie is removed from the browser.

## Features

- **Secure Authentication**: Robust user registration and login functionality with password hashing (`bcrypt`).
- **JWT & `httpOnly` Cookies**: Implements a secure token-based authentication flow.
  - Short-lived **Access Tokens** are used to authorize API requests.
  - Long-lived **Refresh Tokens** are stored securely in `httpOnly` cookies, preventing access from client-side JavaScript and mitigating XSS attacks.
- **Automatic Token Refresh**: Client-side logic (via Axios interceptors) seamlessly refreshes expired access tokens without interrupting the user experience.
- **Protected Routes**: Both backend API routes and frontend UI routes are protected, ensuring only authenticated users can access them.
- **MERN Stack**: A complete boilerplate built with a modern and popular technology stack.
- **Structured & Scalable**: The project is organized into `frontend` and `backend` modules with a clear and scalable folder structure.
- **Ready to Customize**: Provides a solid foundation to build upon for any MERN-stack application requiring user authentication.

## Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- `npm` (or `bun`)
- MongoDB instance (local or cloud)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Numan-Nadeem/auth-app.git
    cd auth-app
    ```

2.  **Setup Backend:**

    ```bash
    cd backend
    npm install
    # or bun install
    ```

    In the `backend` directory, create an environment file. The file should be named according to the environment, following the pattern `.env.${NODE_ENV}.local`. The `NODE_ENV` variable inside the file should match.

    All variables, such as the `PORT` and token expiries, can be customized. The expiry times accept strings in the format understood by the `jsonwebtoken` library (e.g., "15m", "7d", "2h").

    **For Development:**
    Create a `.env.development.local` file:

    ```env
    # .env.development.local
    PORT=<your_dev_port>
    NODE_ENV=development
    MONGO_DB=<your_mongodb_connection_string>
    ACCESS_TOKEN_SECRET=<your_access_token_secret>
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    ACCESS_TOKEN_EXPIRY=<your_access_token_expiry>
    REFRESH_TOKEN_EXPIRY=<your_refresh_token_expiry>
    ```

    **For Production:**
    Create a `.env.production.local` file. It's highly recommended to use a different port and stronger, randomly generated secrets for production.

    ```env
    # .env.production.local
    PORT=<your_production_port>
    NODE_ENV=production
    MONGO_DB=<your_production_mongodb_connection_string>
    ACCESS_TOKEN_SECRET=<your_strong_production_access_secret>
    REFRESH_TOKEN_SECRET=<your_strong_production_refresh_secret>
    ACCESS_TOKEN_EXPIRY=<your_access_token_expiry>
    REFRESH_TOKEN_EXPIRY=<your_refresh_token_expiry>
    ```

3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    # or bun install
    ```

### Running the Application

1.  **Start the backend server (from the `/backend` directory):**

    ```bash
    npm run dev
    ```

    The server will start on `http://localhost:3000`.

2.  **Start the frontend development server (from the `/frontend` directory):**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

## Available Scripts

### Backend (`/backend`)

- `npm run dev`: Starts the backend server with `nodemon` for automatic restarts on file changes.

### Frontend (`/frontend`)

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the source code using ESLint.
- `npm run preview`: Serves the production build locally.

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint        | Description                                                  |
| ------ | --------------- | ------------------------------------------------------------ |
| `POST` | `/auth/signup`  | Register a new user.                                         |
| `POST` | `/auth/login`   | Log in a user and get tokens.                                |
| `POST` | `/auth/logout`  | Log out a user and clear refresh token.                      |
| `GET`  | `/auth/refresh` | Get a new access token using a refresh token.                |
| `GET`  | `/user/me`      | Get the profile of the currently logged-in user (Protected). |

## Project Structure

```
auth-app/
├── backend/
│   ├── config/         # Database and environment configuration
│   ├── controllers/    # Request handlers and business logic
│   ├── middlewares/    # Express middlewares (error handling, token verification)
│   ├── models/         # Mongoose schemas and models
│   ├── routes/         # API routes
│   └── server.js       # Main server entry point
└── frontend/
    ├── public/         # Static assets
    └── src/
        ├── components/   # Reusable React components
        ├── context/      # AuthContext for state management
        ├── pages/        # Page components (Login, Signup, Dashboard)
        ├── services/     # API service layer with Axios
        ├── App.jsx       # Main application component with routing
        └── main.jsx      # Frontend entry point
```

## License

This project is licensed under the ISC License. See the `package.json` files for more details.

## Credits

This project was created by **Numan Nadeem**.

- **GitHub**: [Numan Nadeem](https://github.com/Numan-Nadeem/)
- **LinkedIn**: [Numan Nadeem](https://www.linkedin.com/in/numannadeem/)
