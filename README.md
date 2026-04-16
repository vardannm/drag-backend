# drag-backend

## Auth mode

- Login is enabled via `POST /api/auth/login`.
- Public self-registration is disabled via `POST /api/auth/register` and returns HTTP 403.

## Manually creating users

Use the helper script to create a user with a bcrypt-hashed password:

```bash
npm run create-user -- "Full Name" "login" "plain-text-password"
```

### Requirements

- `MONGODB_URI` must be set in your environment (or `.env`).
- The `login` value must be unique.

### Example

```bash
npm run create-user -- "Admin User" "admin" "StrongPass123!"
```
