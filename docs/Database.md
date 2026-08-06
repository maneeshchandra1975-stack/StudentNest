# Database Schema Design
## CampusNest — MongoDB Collections

**Version:** 1.0  
**Date:** 2026-08-07  
**Status:** Draft  

---

## Overview

CampusNest uses **MongoDB Atlas** with **Mongoose ODM**.  
All collections follow a consistent naming convention (plural, lowercase).

---

## Collections

### 1. `users`
Stores all registered student accounts.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated primary key |
| `name` | String | Full name |
| `email` | String | College email (unique) |
| `password` | String | Bcrypt-hashed password |
| `isVerified` | Boolean | OTP email verification status |
| `role` | Enum | `student` \| `admin` |
| `avatar` | String | Cloudinary image URL |
| `phone` | String | Optional contact number |
| `bookmarks` | [ObjectId] | Refs to Housing listings |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

---

### 2. `housings`
Stores all housing/PG listing posts.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `owner` | ObjectId | Ref → `users` |
| `title` | String | Listing headline |
| `description` | String | Full description |
| `type` | Enum | `room` \| `pg` \| `apartment` \| `hostel` |
| `rent` | Number | Monthly rent (INR) |
| `location` | Object | `{ address, city, coordinates }` |
| `images` | [String] | Cloudinary URLs |
| `amenities` | [String] | Wi-Fi, AC, etc. |
| `isApproved` | Boolean | Admin approval status |
| `isFeatured` | Boolean | Promoted listing |
| `reviews` | [ObjectId] | Refs → `reviews` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

### 3. `products`
Stores marketplace product listings.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `seller` | ObjectId | Ref → `users` |
| `title` | String | Product name |
| `description` | String | Description |
| `category` | String | Books, Electronics, etc. |
| `price` | Number | Asking price (INR) |
| `condition` | Enum | `new` \| `like-new` \| `good` \| `fair` |
| `images` | [String] | Cloudinary URLs |
| `isSold` | Boolean | Sale status |
| `createdAt` | Date | Auto |

---

### 4. `reviews`
Review and rating records.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `author` | ObjectId | Ref → `users` |
| `listing` | ObjectId | Ref → `housings` |
| `rating` | Number | 1–5 star rating |
| `comment` | String | Review text |
| `createdAt` | Date | Auto |

---

### 5. `reports`
Fake/spam listing reports.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `reporter` | ObjectId | Ref → `users` |
| `listing` | ObjectId | Reported listing ID |
| `listingModel` | Enum | `Housing` \| `Product` |
| `reason` | String | Report reason |
| `status` | Enum | `pending` \| `resolved` \| `dismissed` |
| `createdAt` | Date | Auto |

---

### 6. `messages`
Real-time chat messages.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `sender` | ObjectId | Ref → `users` |
| `receiver` | ObjectId | Ref → `users` |
| `content` | String | Message text |
| `read` | Boolean | Read receipt |
| `createdAt` | Date | Auto |

---

### 7. `otps`
Temporary OTP records for email verification.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `email` | String | Target email |
| `otp` | String | Hashed OTP |
| `expiresAt` | Date | TTL — 10 minutes |

---

_Schemas will be implemented as Mongoose models in `/server/models/` during Phase 2+._
