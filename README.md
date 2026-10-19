# Secure Web Application

A Node.js and Express app built following security best practices.

## Features and security measures
- Helmet for secure HTTP headers
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization (express-validator)
- Password hashing with bcrypt
- JWT authentication with 1-hour expiry
- HPP against parameter pollution
- Request body size limit (10kb)
- Secrets stored in environment variables, never committed
- Central error handler that never leaks stack traces
- Request logging with morgan

## Setup
```bash
npm install
cp .env.example .env   # then fill in JWT_SECRET
npm start
```

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Log in and receive a JWT |
| GET | /api/auth/profile | Protected route (needs a token) |

## Vulnerability testing
- `npm audit`: 0 vulnerabilities
- Security headers verified with curl
- Invalid input, XSS and SQL injection payloads rejected (HTTP 400)
- Protected route blocks missing or fake tokens (HTTP 401)
- Rate limiting verified (HTTP 429)

Screenshots are in the `screenshots/` folder.

## Deployment
Live URL: (add after 4.9)