# 🏋️ GymFlow CRM (SaaS)

GymFlow CRM is a production-oriented SaaS Gym Management System built with **Next.js, Node.js, Express.js, and MongoDB**.

The goal of GymFlow CRM is to provide a complete gym management platform that can support multiple gyms with role-based access, gym operations, membership management, staff management, payments, attendance, and subscription-based SaaS functionality.

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
│   │   │   └── membership-plans/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── membership-plans/
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

GymFlow CRM uses role-based access control to provide different levels of access to different users.

Role Hierarchy
Super Admin
     │
     ▼
   Admin
   ┌───────┴────────┐
   ▼                ▼
Receptionist      Trainer
Super Admin

Super Admin has the highest level of system access.

Responsibilities:

Manage Admin accounts
Manage system-level settings
Manage SaaS subscriptions
Manage gyms/tenants
Access platform-wide analytics
Manage overall SaaS infrastructure

The Super Admin frontend/dashboard will be implemented later, while the role is being considered in the backend architecture from the beginning.

Admin

Admin manages the operations of an individual gym.

Responsibilities:

Create and manage Receptionist accounts
Create and manage Trainer accounts
Manage Members
Manage Membership Plans
Manage gym operations
Manage payments
Manage attendance
Access administrative reports
Manage gym settings
Receptionist

Receptionist handles front-desk and customer-facing operations.

Planned responsibilities:

Member registration
Member information
Membership operations
Attendance
Payments
Appointments

Receptionists cannot create or manage Admin accounts.

Trainer

Trainer handles member training-related operations.

Planned responsibilities:

Assigned members
Workout plans
Member progress
Trainer attendance
Appointments

Trainers cannot create or manage Admin accounts.

🔑 Account Creation Flow

The planned account hierarchy is:

Super Admin
     │
     └── Creates Admin
            │
            ├── Creates Receptionist
            │
            └── Creates Trainer

Super Admin accounts will not be created through the normal Admin dashboard.

The initial Super Admin account will be created through a secure setup/seed process.

✅ Features Completed
Authentication
User Registration
User Login
Password Hashing
JWT Authentication
Protected Routes
Authentication Context
Role-Based Authorization
🛡️ Role-Based Access Control

Implemented:

Authentication Middleware
Authorization Middleware
Protected APIs
Role-based route permissions
Admin-only operations
Role-based API access

Supported roles:

Super Admin
Admin
Receptionist
Trainer
💳 Membership Plans Module

The Membership Plans module is currently implemented for the Admin dashboard.

Completed Features
View all membership plans
Search membership plans
Create membership plan
Edit membership plan
Delete membership plan
Delete confirmation modal
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
Hover-based feature preview
Animated feature popup
🔗 Membership Plans API

The Membership Plans module supports full CRUD operations.

GET     /api/membership-plans
GET     /api/membership-plans/:id
POST    /api/membership-plans
PUT     /api/membership-plans/:id
DELETE  /api/membership-plans/:id
Frontend Service Functions
getAllMembershipPlans()
getMembershipPlanById()
createMembershipPlan()
updateMembershipPlan()
deleteMembershipPlan()
API Responsibilities
getAllMembershipPlans()
        ↓
Returns all membership plans

getMembershipPlanById()
        ↓
Returns one specific membership plan

createMembershipPlan()
        ↓
Creates a new membership plan

updateMembershipPlan()
        ↓
Updates an existing membership plan

deleteMembershipPlan()
        ↓
Deletes a membership plan
🎨 Membership Plans UI

The Membership Plans interface includes:

Responsive data table
Search toolbar
Add Plan modal
Edit Plan modal
Delete confirmation modal
Active/Inactive status badges
Plan feature preview
Hover-based feature popup
Popup animation
Feature fade-in animation
Loading indicator
Empty state
Error handling

The feature popup opens automatically when the user moves the cursor over the View All area.

No additional click is required.

👥 Members Module

Backend CRUD APIs have been implemented for members.

Completed APIs:

Create Member
Get All Members
Get Single Member
Update Member
Delete Member

Frontend member management is part of the upcoming Admin dashboard development.

🧪 Backend Testing

Backend APIs are being tested using Postman.

Testing includes:

JWT Authentication
Protected Routes
Role-Based Access Control
CRUD Operations
Request Validation
Authorization Errors
API Responses
🔄 Application Architecture

GymFlow CRM follows a modular full-stack architecture:

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

The long-term architecture will allow:

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

Each gym will have isolated operational data while the Super Admin manages the overall SaaS platform.

🔜 Upcoming Features
Admin Dashboard
Members Management
Staff Management
Trainer Management
Receptionist Management
Attendance Management
Payments
Reports
Notifications
Settings
Receptionist Dashboard
Member Registration
Member Management
Membership Operations
Attendance
Payments
Appointments
Trainer Dashboard
Assigned Members
Workout Plans
Member Progress
Trainer Attendance
Appointments
Super Admin Panel
Admin Account Management
Gym/Tenant Management
SaaS Subscription Management
System Analytics
Platform Settings
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
│
├── Project Setup                  ✅
├── Frontend Setup                 ✅
├── Backend Setup                  ✅
├── MongoDB Integration            ✅
├── Authentication                 ✅
├── JWT Authentication             ✅
├── RBAC                            ✅
└── Backend Foundation             ✅


PHASE 2 — ADMIN MODULE
│
├── Admin Dashboard                🔄
├── Membership Plans               ✅
├── Members Module                 🔄
├── Staff Management               ⏳
├── Attendance                     ⏳
├── Payments                       ⏳
├── Reports                        ⏳
└── Settings                       ⏳


PHASE 3 — RECEPTIONIST MODULE
│
├── Receptionist Dashboard         ⏳
├── Member Operations              ⏳
├── Membership Operations          ⏳
├── Attendance                     ⏳
├── Payments                       ⏳
└── Appointments                   ⏳


PHASE 4 — TRAINER MODULE
│
├── Trainer Dashboard              ⏳
├── Assigned Members               ⏳
├── Workout Plans                  ⏳
├── Member Progress                ⏳
├── Trainer Attendance             ⏳
└── Appointments                   ⏳


PHASE 5 — SUPER ADMIN
│
├── Super Admin Dashboard          ⏳
├── Admin Management               ⏳
├── Gym/Tenant Management          ⏳
├── Platform Analytics             ⏳
└── System Settings                ⏳


PHASE 6 — SaaS
│
├── Multi-Tenant Architecture      ⏳
├── Subscription Management        ⏳
├── Billing                         ⏳
├── Tenant Isolation                ⏳
├── Notifications                  ⏳
└── Production Deployment           ⏳
🎯 Project Goal

The long-term goal of GymFlow CRM is to become a production-ready SaaS platform where multiple gyms can independently manage:

Members
Memberships
Trainers
Receptionists
Attendance
Payments
Reports
Gym operations

while the platform owner manages:

Gyms/Tenants
Admin accounts
SaaS subscriptions
Platform analytics
System configuration


👨‍💻 Developer

Abdul Majid Khan

Software Engineering Student

Building GymFlow CRM as a Production-Level SaaS Application.