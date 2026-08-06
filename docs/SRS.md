# Software Requirements Specification (SRS)
## CampusNest — Trusted Campus Housing & Marketplace Platform

**Version:** 1.0  
**Date:** 2026-08-07  
**Status:** Draft  

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for CampusNest, a trusted campus housing and marketplace web application built exclusively for VIT-AP University students.

### 1.2 Scope
CampusNest enables students to find housing, discover roommates, buy and sell second-hand goods, and communicate securely — all within a college-email-verified ecosystem.

### 1.3 Definitions
| Term | Definition |
|---|---|
| Student | A registered user with a verified VIT-AP college email |
| Listing | A housing or product post created by a student |
| OTP | One-Time Password used for email verification |
| Admin | A privileged user with platform management rights |

---

## 2. Overall Description

### 2.1 Product Perspective
A MERN Stack SaaS application. Frontend deployed on Vercel, Backend on Render, Database on MongoDB Atlas.

### 2.2 User Classes
- **Students** — Primary users of the platform
- **Admins** — Internal platform administrators

---

## 3. Functional Requirements

> _To be expanded phase by phase as features are built._

### 3.1 Authentication
- FR-AUTH-01: Students must register with a VIT-AP email (`@vitapstudent.ac.in`)
- FR-AUTH-02: Email must be verified via OTP before access is granted
- FR-AUTH-03: Students must be able to log in with email and password
- FR-AUTH-04: JWT-based session management

### 3.2 Housing Marketplace
- FR-HOUSE-01: Students can post housing listings with images, price, and location
- FR-HOUSE-02: Students can search and filter listings
- FR-HOUSE-03: Students can bookmark listings
- FR-HOUSE-04: Students can leave reviews on listings

### 3.3 Student Marketplace
- FR-MARKET-01: Students can post products for sale
- FR-MARKET-02: Students can search and filter products

### 3.4 Roommate Finder
- FR-ROOM-01: Students can create a roommate profile
- FR-ROOM-02: Students can search compatible roommates

### 3.5 Real-Time Chat
- FR-CHAT-01: Students can message each other in real time via Socket.IO

### 3.6 Admin Panel
- FR-ADMIN-01: Admins can approve/reject listings
- FR-ADMIN-02: Admins can ban users
- FR-ADMIN-03: Admins can view platform analytics

---

## 4. Non-Functional Requirements

- **Security:** All passwords hashed with bcrypt. JWTs signed with RS256 or HS256.
- **Performance:** API responses < 300ms for standard queries.
- **Scalability:** Horizontal scaling supported via stateless REST architecture.
- **Availability:** 99.9% uptime target.
- **Accessibility:** WCAG 2.1 AA compliance.

---

_Full specification to be completed before each development phase._
