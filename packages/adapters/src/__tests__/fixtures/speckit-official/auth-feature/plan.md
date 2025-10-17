# Implementation Plan: User Authentication System

**Branch**: `feature/001-auth-system` **Date**: 2025-01-15 **Spec**:
[spec.md](./spec.md)

## Summary

Implement a secure JWT-based authentication system with user registration,
login, password reset, and token refresh capabilities. The system will use
Node.js/TypeScript with Express.js, PostgreSQL for data storage, and Redis for
session management.

## Technical Context

- **Language/Version**: TypeScript 5.3, Node.js 20 LTS
- **Dependencies**:
  - express ^4.18.0
  - jsonwebtoken ^9.0.2
  - bcrypt ^5.1.1
  - @types/node ^20.0.0
  - zod ^3.22.0 (validation)
  - pg ^8.11.0 (PostgreSQL client)
  - redis ^4.6.0 (session management)
  - nodemailer ^6.9.0 (email sending)
- **Storage**: PostgreSQL 15+ for user data, Redis 7+ for session/rate limiting
- **Testing**: Vitest for unit tests, Supertest for API tests
- **Target**: REST API server, containerized with Docker
- **Type**: Backend service
- **Performance Goals**:
  - Authentication endpoint response time < 200ms (p95)
  - Support 100 concurrent requests
- **Constraints**:
  - Must comply with OWASP authentication guidelines
  - Must support horizontal scaling
- **Scale**: Expected initial load: 1000 daily active users, 10,000 total users

## Constitution Check

✅ **Modularity**: Authentication logic separated into controller, service, and
repository layers ✅ **Testability**: Each component has clear interfaces for
mocking ✅ **Security**: Follows OWASP Top 10 guidelines, password hashing, JWT
validation ✅ **Performance**: Redis caching for rate limiting, indexed database
queries ✅ **Maintainability**: TypeScript for type safety, clear error handling
✅ **Documentation**: OpenAPI/Swagger docs for all endpoints

## Project Structure

### Documentation

```
specs/
└── 001-auth-system/
    ├── spec.md (this file's sibling)
    ├── plan.md (this file)
    └── tasks.md (to be generated)
```

### Source Code Structure

#### Option 1: Modular Backend Service (Selected)

```
src/
├── modules/
│   └── auth/
│       ├── auth.controller.ts      # HTTP endpoints
│       ├── auth.service.ts         # Business logic
│       ├── auth.repository.ts      # Data access
│       ├── auth.validation.ts      # Zod schemas
│       ├── auth.middleware.ts      # JWT verification
│       └── __tests__/
│           ├── auth.controller.test.ts
│           ├── auth.service.test.ts
│           └── auth.integration.test.ts
├── entities/
│   ├── user.entity.ts
│   ├── auth-token.entity.ts
│   ├── audit-log.entity.ts
│   └── password-reset.entity.ts
├── database/
│   ├── migrations/
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_auth_tokens_table.sql
│   │   ├── 003_create_audit_logs_table.sql
│   │   └── 004_create_password_resets_table.sql
│   └── connection.ts
├── utils/
│   ├── jwt.util.ts
│   ├── hash.util.ts
│   ├── email.util.ts
│   └── rate-limit.util.ts
├── config/
│   ├── env.ts
│   └── constants.ts
└── app.ts
```

## Implementation Details

### API Endpoints

**POST /api/auth/register**

- Request: `{ email: string, password: string }`
- Response: `{ user: { id, email }, token: string }`
- Errors: 400 (validation), 409 (email exists)

**POST /api/auth/login**

- Request: `{ email: string, password: string }`
- Response: `{ user: { id, email }, token: string, refreshToken: string }`
- Errors: 401 (invalid credentials), 423 (account locked)

**POST /api/auth/logout**

- Request: Headers with JWT
- Response: 204 No Content
- Errors: 401 (unauthorized)

**POST /api/auth/refresh**

- Request: `{ refreshToken: string }`
- Response: `{ token: string, refreshToken: string }`
- Errors: 401 (invalid/expired token)

**POST /api/auth/password-reset/request**

- Request: `{ email: string }`
- Response: 200 OK (always, for security)
- Errors: 429 (rate limit)

**POST /api/auth/password-reset/confirm**

- Request: `{ token: string, newPassword: string }`
- Response: 200 OK
- Errors: 400 (invalid token), 410 (expired token)

### Database Schema

**users table**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  account_locked BOOLEAN DEFAULT FALSE,
  failed_login_count INTEGER DEFAULT 0
);
CREATE INDEX idx_users_email ON users(email);
```

**auth_tokens table**

```sql
CREATE TABLE auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX idx_auth_tokens_refresh_token ON auth_tokens(refresh_token);
```

**audit_logs table**

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

**password_resets table**

```sql
CREATE TABLE password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_password_resets_token ON password_resets(token);
```

### Configuration

**Environment Variables**

```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=<generate-secure-secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=auth@example.com
SMTP_PASS=<smtp-password>

# Security
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=10
PASSWORD_RESET_EXPIRY=24h
```

### Security Measures

1. **Password Security**
   - Bcrypt hashing with cost factor 10
   - Minimum 8 characters, complexity requirements enforced
   - Old passwords not stored (for comparison)

2. **JWT Security**
   - Signed with HS256 algorithm
   - Short expiration (15 minutes)
   - Refresh tokens stored in database, long-lived (7 days)
   - Token blacklisting on logout via Redis

3. **Rate Limiting**
   - 10 requests per minute per IP on auth endpoints
   - Implemented with Redis sliding window
   - Account lockout after 5 failed login attempts

4. **Audit Logging**
   - All authentication events logged
   - IP address and user agent captured
   - 90-day retention policy

## Complexity Tracking

### Complex Design Decision: Token Refresh Strategy

**Problem**: Need to balance security (short-lived tokens) with UX (not forcing
frequent re-logins)

**Solution**: Dual-token approach

- Short-lived JWT (15 min) for API access
- Long-lived refresh token (7 days) stored in database
- Automatic token refresh before expiration
- Refresh token rotation on each use

**Justification**:

- JWT is stateless and fast to validate
- Refresh tokens are revocable (database-backed)
- Compromise of JWT has limited window
- UX stays smooth with automatic refresh
- Meets security best practices (OWASP)
