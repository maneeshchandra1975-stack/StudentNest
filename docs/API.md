# API Reference
## CampusNest REST API

**Version:** v1  
**Base URL:** `https://api.campusnest.in/api/v1`  
**Local URL:** `http://localhost:5000/api/v1`  
**Format:** JSON  
**Auth:** Bearer Token (JWT)  

---

## Authentication

All protected endpoints require the following header:

```
Authorization: Bearer <token>
```

---

## Endpoints Overview

> _Detailed endpoint specs will be added as each phase is implemented._

### System
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Health check |

### Auth (Phase 2)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Register new student |
| POST | `/auth/verify-otp` | None | Verify college email |
| POST | `/auth/login` | None | Login and receive JWT |
| POST | `/auth/logout` | Student | Logout |
| GET | `/auth/me` | Student | Get current user |

### Housing (Phase 3)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/housing` | None | List all approved listings |
| GET | `/housing/:id` | None | Get single listing |
| POST | `/housing` | Student | Create new listing |
| PUT | `/housing/:id` | Student | Update own listing |
| DELETE | `/housing/:id` | Student | Delete own listing |
| POST | `/housing/:id/bookmark` | Student | Bookmark a listing |
| POST | `/housing/:id/review` | Student | Leave a review |

### Marketplace (Phase 4)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | None | List all products |
| GET | `/products/:id` | None | Get single product |
| POST | `/products` | Student | Create product listing |
| PUT | `/products/:id` | Student | Update own product |
| DELETE | `/products/:id` | Student | Delete own product |

### Admin (Phase 8)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/users` | Admin | List all users |
| PATCH | `/admin/listings/:id/approve` | Admin | Approve listing |
| DELETE | `/admin/users/:id` | Admin | Ban user |
| GET | `/admin/analytics` | Admin | Platform analytics |

---

## Standard Response Format

### Success
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## HTTP Status Codes
| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |
