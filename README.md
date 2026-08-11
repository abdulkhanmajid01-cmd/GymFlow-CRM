# 🏋️ GymFlow CRM (SaaS)

GymFlow CRM is a production-oriented SaaS Gym Management System built with **Next.js, Node.js, Express.js, and MongoDB**.

The goal of GymFlow CRM is to provide a complete gym management platform with role-based access, membership management, staff management, attendance, payments, reports, and subscription-based SaaS functionality.

---

# 🚀 Tech Stack

## Frontend

- Next.js 16
- React.js
- JavaScript
- Tailwind CSS
- App Router
- React Hooks

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication & Security

- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- Role-Based Access Control (RBAC)
- Authorization Middleware

---

# 📁 Project Structure

```text
GymFlow-CRM/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── members/
│   │   │   ├── membership-plans/
│   │   │   └── staff/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── membership-plans/
│   │   │   └── staff/
│   │   │
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── constants/
│   │   ├── styles/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── README.md
🔐 Authentication & Role-Based Access Control

GymFlow CRM uses JWT-based authentication and role-based authorization.

Supported Roles
Admin
   │
   ├── Receptionist
   │
   └── Trainer

A future Super Admin role is planned for the SaaS platform layer.

👑 Admin

The Admin manages the operations of an individual gym.

Admin Permissions
Access Admin Dashboard
Manage Members
Create Receptionist accounts
Create Trainer accounts
Edit Receptionist accounts
Edit Trainer accounts
Delete Receptionist accounts
Delete Trainer accounts
Manage Membership Plans
Manage Payments
Manage Attendance
Access administrative reports
Manage gym settings

Admin accounts cannot be created or deleted through Staff Management.

🧑‍💼 Receptionist

Receptionists handle front-desk and customer-facing gym operations.

Receptionist Permissions
Access Receptionist Dashboard
View Members
Create Members
Update Members
Manage Membership Operations
Manage Attendance
Manage Payments
Handle customer-facing operations

Receptionists cannot:

Create Staff accounts
Manage Admin accounts
Manage Membership Plan configuration
Access Admin-only settings
🏋️ Trainer

Trainers handle training-related gym operations.

Trainer Permissions
Access Trainer Dashboard
View Members
View assigned/member information
Manage Attendance
Training-related operations

Future Trainer features include:

Assigned Members
Workout Plans
Member Progress
Trainer Attendance
Appointments

Trainers cannot:

Create Staff accounts
Manage Admin accounts
Manage Membership Plans
Manage Payments
Access Admin settings
🔑 Account Creation Flow

The current staff creation flow is:

Admin
  │
  ├── Create Receptionist
  │
  └── Create Trainer

Staff accounts are created directly from the Admin Dashboard → Staff Management interface.

No dummy staff data is used.

Staff displayed in the Staff Management page comes directly from the MongoDB database.

A future SaaS architecture will introduce:

Super Admin
     │
     ▼
   Admin
   ┌───────┴────────┐
   ▼                ▼
Receptionist      Trainer
🛡️ Authentication Middleware

GymFlow CRM currently uses two major middleware layers.

Protect Middleware

The protect middleware:

Reads JWT from Authorization header
Verifies JWT token
Loads the authenticated user
Attaches user information to req.user
Rejects missing or invalid tokens

Example:

Authorization: Bearer <JWT_TOKEN>
Authorization Middleware

The authorize() middleware checks the authenticated user's role.

Examples:

authorize("admin")
authorize("admin", "receptionist")
authorize("admin", "receptionist", "trainer")

This provides API-level Role-Based Access Control.

👥 Staff Management Module

The Staff Management module is implemented for the Admin dashboard.

Completed Features
View all staff
Create Receptionist
Create Trainer
Edit staff
Update staff role
Update staff email
Update staff password
Activate/deactivate staff
Delete staff
Email uniqueness validation
Password hashing
Role validation
Admin-only staff management
Loading states
Error handling
Empty states
Delete confirmation
Dynamic staff information
Role-based UI

Only users with the admin role can access Staff Management.

🔗 Staff Management API

The Staff module supports full CRUD operations.

GET     /api/staff
POST    /api/staff
PUT     /api/staff/:id
DELETE  /api/staff/:id

All Staff Management endpoints are protected.

protect
   ↓
authorize("admin")
   ↓
Controller
👤 Staff Data Model

Staff accounts use the existing User model.

Supported roles:

admin
receptionist
trainer

User records contain:

Full Name
Email
Password
Role
Active Status
Created At
Updated At

Passwords are never stored as plain text.

They are hashed using bcrypt.

🔐 Staff Security

Staff creation follows this process:

Admin Dashboard
      ↓
Staff Form
      ↓
POST /api/staff
      ↓
JWT Verification
      ↓
Admin Authorization
      ↓
Email Validation
      ↓
Password Hashing
      ↓
MongoDB

This ensures that staff accounts are created through the actual application workflow.

💳 Membership Plans Module

The Membership Plans module is implemented for the Admin dashboard.

Completed Features
View all membership plans
Search membership plans
Create membership plan
Edit membership plan
Delete membership plan
Delete confirmation
Membership plan status
Plan duration
Plan pricing
Plan description
Plan features
Loading states
Error states
Empty states
Reusable DataTable
Reusable Modal
Reusable Button
Status badges
Feature preview
Animated feature popup

Membership Plan configuration is currently an Admin-only operation.

🔗 Membership Plans API
GET     /api/membership-plans
GET     /api/membership-plans/:id
POST    /api/membership-plans
PUT     /api/membership-plans/:id
DELETE  /api/membership-plans/:id

Frontend service functions:

getAllMembershipPlans()
getMembershipPlanById()
createMembershipPlan()
updateMembershipPlan()
deleteMembershipPlan()
👥 Members Module

The Members module includes backend CRUD functionality.

Completed Backend APIs
GET     /api/members
GET     /api/members/:id
POST    /api/members
PUT     /api/members/:id
DELETE  /api/members/:id
Current Permissions
View Members
    │
    ├── Admin
    ├── Receptionist
    └── Trainer

Create / Update Members
    │
    ├── Admin
    └── Receptionist

Delete Members
    │
    └── Admin
🔔 Membership Expiry Notifications

GymFlow CRM includes membership expiry notifications.

The system checks membership expiry dates and generates alerts for:

Expired memberships
Memberships expiring today
Memberships expiring tomorrow
Memberships expiring within 3 days
Memberships expiring within 7 days

Notifications are displayed in the dashboard Navbar.

🧪 Backend Testing

Backend APIs are being tested using Postman during development.

Testing includes:

JWT Authentication
Protected Routes
Role-Based Access Control
CRUD Operations
Request Validation
Authorization Errors
API Responses

Frontend-to-backend integration testing is also performed through the actual application.

🔄 Application Architecture

GymFlow CRM follows a modular full-stack architecture.

Next.js Frontend
       │
       ▼
Frontend Services
       │
       ▼
REST API
       │
       ▼
Express Routes
       │
       ▼
Authentication Middleware
       │
       ▼
Authorization Middleware
       │
       ▼
Controllers
       │
       ▼
Mongoose Models
       │
       ▼
MongoDB
🏢 SaaS Architecture

GymFlow CRM is planned as a multi-tenant SaaS application.

Long-term architecture:

GymFlow CRM
│
├── Gym / Tenant A
│   ├── Admin
│   ├── Receptionists
│   ├── Trainers
│   └── Members
│
├── Gym / Tenant B
│   ├── Admin
│   ├── Receptionists
│   ├── Trainers
│   └── Members
│
└── Super Admin
    └── Platform Management

Each gym will eventually have isolated operational data.

🚧 Upcoming Features
Admin Module
Attendance Management
Payments
Reports
Settings
Receptionist Module
Receptionist Dashboard
Member Registration
Member Management
Membership Operations
Attendance
Payments
Appointments
Trainer Module
Trainer Dashboard
Assigned Members
Workout Plans
Member Progress
Trainer Attendance
Appointments
Super Admin
Super Admin Dashboard
Admin Account Management
Gym/Tenant Management
SaaS Subscription Management
Platform Analytics
System Settings
SaaS Features
Multi-Tenant Architecture
Gym Registration
Subscription Plans
Subscription Billing
Tenant Data Isolation
SaaS Analytics
Platform Administration
🗺️ Development Roadmap
PHASE 1 — FOUNDATION
Project Setup                  ✅
Frontend Setup                 ✅
Backend Setup                  ✅
MongoDB Integration            ✅
Authentication                 ✅
JWT Authentication             ✅
RBAC                           ✅
Backend Foundation             ✅
PHASE 2 — ADMIN MODULE
Admin Dashboard                🔄
Membership Plans               ✅
Members Module                 🔄
Staff Management               ✅
Attendance                     ⏳
Payments                       ⏳
Reports                        ⏳
Settings                       ⏳
PHASE 3 — RECEPTIONIST MODULE
Receptionist Dashboard         ⏳
Member Operations              ⏳
Membership Operations          ⏳
Attendance                     ⏳
Payments                       ⏳
Appointments                   ⏳
PHASE 4 — TRAINER MODULE
Trainer Dashboard              ⏳
Assigned Members               ⏳
Workout Plans                  ⏳
Member Progress                ⏳
Trainer Attendance             ⏳
Appointments                   ⏳
PHASE 5 — SUPER ADMIN
Super Admin Dashboard          ⏳
Admin Management               ⏳
Gym/Tenant Management          ⏳
Platform Analytics             ⏳
System Settings                ⏳
PHASE 6 — SaaS
Multi-Tenant Architecture      ⏳
Subscription Management        ⏳
Billing                        ⏳
Tenant Isolation               ⏳
Notifications                  ⏳
Production Deployment           ⏳
🎯 Project Goal

The long-term goal of GymFlow CRM is to become a production-ready SaaS platform where multiple gyms can independently manage:

Members
Memberships
Trainers
Receptionists
Attendance
Payments
Reports
Gym Operations

while the platform owner manages:

Gyms/Tenants
Admin Accounts
SaaS Subscriptions
Platform Analytics
System Configuration
👨‍💻 Developer

Abdul Majid Khan

Software Engineering Student

Building GymFlow CRM as a Production-Level SaaS Application.