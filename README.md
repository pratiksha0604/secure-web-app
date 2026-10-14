# Secure Web Application

A web application built with Node.js and Express that follows security best practices.

## Features
- **Helmet**: sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- **Rate limiting**: 100 requests per 15 minutes per IP to slow brute-force attacks
- **CORS**: restricts which origins can call the API
- **Input validation**: express-validator checks email and password
- **Password hashing**: bcrypt with 12 salt rounds, so no plain-text passwords
- **Payload limit**: JSON bodies are capped at 10kb
- **Safe error handling**: internal errors are logged, and clients only see a generic message
- **Environment variables**: secrets stay in `.env`, which is never committed

## Setup
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in the values
4. Run `npm run dev` (development) or `npm start` (production)

## Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /health | Health check |
| POST | /register | Register a user (validated, password hashed) |

## Security Testing
- `npm audit` for dependency vulnerabilities
- Header check for Helmet protections
- XSS and injection attempts rejected by validation
- Oversized payloads rejected (413)
- Rate limiting verified

## Tech Stack
Node.js, Express, Helmet, express-rate-limit, express-validator, bcryptjs, dotenv