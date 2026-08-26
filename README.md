# 🏋️ GymFlow CRM (SaaS)

GymFlow CRM is a production-oriented multi-tenant SaaS Gym Management System built with **Next.js, Node.js, Express.js, and MongoDB**.

The platform enables multiple gyms to independently manage their members, staff, membership plans, and attendance — while a Super Admin manages the entire platform from a centralized dashboard.

---

# 🚀 Tech Stack

## Frontend

- Next.js 16 (App Router)
- React 19
- JavaScript
- Tailwind CSS 4
- React Hooks
- lucide-react (icons)
- framer-motion (animations)

## Backend

- Node.js
- Express.js 5
- MongoDB
- Mongoose 9

## Authentication & Security

- JWT Authentication
- bcrypt Password Hashing (native C++)
- Protected Routes
- Role-Based Access Control (RBAC)
- Authorization Middleware
- Multi-Tenant Data Isolation
- Gym-Scoped Compound Unique Indexes

## Development Tools

- nodemon (backend hot reload)
- ESLint (frontend linting)
- PostCSS
- cors, helmet, express-rate-limit, dotenv

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
│   │   │   ├── staff/
│   │   │   └── super-admin/
│   │   │       ├── page.jsx
│   │   │       ├── gyms/
│   │   │       │   ├── page.jsx
│   │   │       │   ├── create/
│   │   │       │   └── [id]/
│   │   │       │       ├── page.jsx
│   │   │       │       └── edit/
│   │   │       ├── gym-administrators/
│   │   │       │   └── page.jsx
│   │   │       └── platform-administration/
│   │   │           └── page.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge/
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/
│   │   │   │   ├── DataTable/
│   │   │   │   ├── EmptyState/
│   │   │   │   ├── Input/
│   │   │   │   ├── Loader/
│   │   │   │   ├── Modal.js
│   │   │   │   ├── Pagination/
│   │   │   │   └── SearchInput/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── members/
│   │   │   ├── membership-plans/
│   │   │   └── staff/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   └── services/
│   │       ├── api.js
│   │       ├── authService.js
│   │       ├── gymAdminService.js
│   │       ├── memberService.js
│   │       ├── membershipPlanService.js
│   │       ├── platformService.js
│   │       └── staffService.js
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── gymController.js
│   │   ├── gymAdminController.js
│   │   ├── memberController.js
│   │   ├── membershipPlanController.js
│   │   ├── membershipReminderController.js
│   │   ├── platformController.js
│   │   └── staffController.js
│   ├── middleware/
│   │   ├── asyncHandler.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   └── protect.js
│   ├── models/
│   │   ├── Attendance.js
│   │   ├── Gym.js
│   │   ├── Member.js
│   │   ├── MembershipPlan.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── gymRoutes.js
│   │   ├── gymAdminRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── membershipPlanRoutes.js
│   │   ├── membershipReminderRoutes.js
│   │   ├── platformRoutes.js
│   │   └── staffRoutes.js
│   ├── utils/
│   │   ├── checkEmailExists.js
│   │   ├── generateToken.js
│   │   └── membershipExpiryReminder.js
│   ├── migrations/
│   │   └── fix-member-indexes.js
│   └── server.js
│
└── README.md
```

---

# 🔐 Authentication & Role-Based Access Control

GymFlow CRM uses JWT-based authentication and role-based authorization.

## Supported Roles

```
Super Admin
    │
    ▼
  Admin
    │
    ├── Receptionist
    │
    └── Trainer
```

- **Super Admin** — Platform-level access. Manages gyms, gym administrators, and platform-wide statistics.
- **Admin** — Manages operations of an individual gym. Created automatically when a Super Admin creates a new gym.
- **Receptionist** — Handles front-desk and customer-facing gym operations.
- **Trainer** — Handles training-related operations. Sees only assigned members.

## Authentication Flow

1. User submits email + password to `POST /api/auth/login`
2. Backend validates credentials and checks account `isActive` status
3. For non-superAdmin users, backend checks if their gym is active (`Gym.isActive`)
4. If all checks pass, backend generates JWT and returns user data including `role` and `gymId`
5. Frontend stores token in `localStorage` and redirects based on role

## Public Registration

Public registration is **disabled**. Users must be created through the authorized chain:

```
Super Admin → Create Gym (creates Gym Admin automatically)
       │
       ▼
  Gym Admin → Create Staff (Receptionist / Trainer)
```

---

# 🛡️ Authentication Middleware

GymFlow CRM uses three middleware layers.

## protect Middleware

- Reads JWT from `Authorization: Bearer <TOKEN>` header
- Verifies JWT token
- Loads the authenticated user from database
- Attaches user information to `req.user`
- Rejects missing or invalid tokens

## authorize() Middleware

Checks the authenticated user's role against allowed roles:

```js
authorize("admin")
authorize("admin", "receptionist")
authorize("admin", "receptionist", "trainer")
authorize("superAdmin")
```

This provides API-level Role-Based Access Control.

## asyncHandler Middleware

Wraps async route handlers to automatically catch and forward errors to the global error handler.

## errorHandler Middleware

Global error handler mounted at the end of the Express pipeline. Handles MongoDB duplicate key errors (11000) and returns structured JSON error responses.

---

# 🏢 Multi-Tenant Architecture

GymFlow CRM implements a multi-tenant SaaS architecture where each gym is an isolated tenant.

## Tenant Isolation

Every data model belongs to a specific gym through a `gymId` field:

| Model | gymId Field | Scope |
|---|---|---|
| User | `gymId` (ObjectId, ref: Gym) | Admin, Receptionist, Trainer belong to a gym. Super Admin has `gymId = null` |
| Member | `gymId` (ObjectId, ref: Gym, required) | Every member belongs to one gym |
| MembershipPlan | `gymId` (ObjectId, ref: Gym, required) | Plans are gym-specific |
| Attendance | `gymId` (ObjectId, ref: Gym, required) | Attendance records are gym-specific |

## Gym-Scoped Uniqueness

Compound unique indexes ensure values are unique **within a gym** but can repeat **across gyms**:

| Collection | Compound Index | Purpose |
|---|---|---|
| Members | `{ gymId, memberId }` | Member ID unique per gym |
| Members | `{ gymId, email }` | Email unique per gym |
| Members | `{ gymId, phoneNumber }` | Phone unique per gym |
| Members | `{ gymId, cnic }` | CNIC unique per gym |
| MembershipPlans | `{ gymId, planName }` | Plan name unique per gym |
| Attendance | `{ gymId, member, date }` | One attendance record per member per day per gym |

## Controller-Level Isolation

Every controller filters data by `req.user.gymId`:

```js
// Example: Member controller
const gymId = req.user.gymId;
const members = await Member.find({ gymId });
```

This ensures:
- Gym A's members are never exposed to Gym B
- Each gym's plans, staff, and attendance are fully isolated
- Super Admin (with `gymId = null`) can access platform-wide data through dedicated endpoints

## Data Protection Guarantees

- Members from Gym A **cannot** be accessed by users from Gym B
- Membership plans from Gym A **cannot** be assigned to members of Gym B
- Staff accounts are scoped to the gym they were created in
- `gymId` is never trusted from the frontend — it always comes from `req.user.gymId`

---

# 👑 Super Admin

The Super Admin has platform-level access to GymFlow CRM.

## Super Admin Dashboard

- View total gyms, active gyms, and inactive gyms
- Quick navigation to Gym Management and Gym Administrators
- Platform Administration overview card

## Super Admin Permissions

| Feature | Access |
|---|---|
| Super Admin Dashboard | ✅ |
| Gym Management (CRUD) | ✅ |
| Gym Administrators (view, toggle status) | ✅ |
| Platform Administration (statistics) | ✅ |
| Gym-scoped modules (Members, Plans, Staff) | ❌ |

## Super Admin Sidebar Navigation

- Super Admin Dashboard
- Gyms
- Platform Administration

---

# 🏢 Gym Management

Super Admin can create, view, update, and manage gyms.

## Create Gym Flow

When Super Admin creates a gym, a **Gym Admin account is automatically created** in the same operation:

1. Super Admin submits gym details + admin details
2. Backend creates the Gym document
3. Backend creates the Admin User with `role: "admin"` and `gymId` set to the new gym
4. If admin creation fails, the gym is rolled back (atomic operation)

## Gym Management Features

- View all gyms with status indicators
- Create new gym with admin account
- View gym details (gym info + admin info)
- Edit gym information
- Toggle gym active/inactive status

## Gym Status Toggle

When a gym is deactivated:
- The gym's `isActive` is set to `false`
- **All admin accounts** of that gym are automatically deactivated
- Receptionists and trainers are NOT affected

When a gym is activated:
- The gym's `isActive` is set to `true`
- **All admin accounts** of that gym are automatically reactivated

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/gyms` | Get all gyms | Super Admin |
| GET | `/api/gyms/:id` | Get single gym + admin | Super Admin |
| POST | `/api/gyms` | Create gym + admin | Super Admin |
| PUT | `/api/gyms/:id` | Update gym | Super Admin |
| PATCH | `/api/gyms/:id/status` | Toggle gym status | Super Admin |

## Gym Data Model

| Field | Type | Description |
|---|---|---|
| name | String (required, unique) | Gym name |
| email | String | Gym contact email |
| phoneNumber | String | Gym phone number |
| address | String | Gym address |
| isActive | Boolean (default: true) | Gym active status |
| timestamps | — | createdAt, updatedAt |

---

# 👥 Gym Administrators

Super Admin can view and manage gym administrator accounts.

## Features

- View all gym administrators with populated gym information
- View single gym administrator details
- Toggle administrator active/inactive status
- Activation guard: cannot activate an admin whose gym is inactive

## Activation Guard

An administrator assigned to an **inactive gym** cannot be activated. The gym must be activated first. Deactivation is always allowed.

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/gym-admins` | Get all gym admins | Super Admin |
| GET | `/api/gym-admins/:id` | Get single gym admin | Super Admin |
| PATCH | `/api/gym-admins/:id/status` | Toggle admin status | Super Admin |

---

# 📊 Platform Administration

Super Admin has platform-level access to GymFlow statistics.

## Platform Statistics

The Platform Administration page displays platform-wide statistics:

### Gym Overview
- Total Gyms
- Active Gyms
- Inactive Gyms

### Gym Administrator Overview
- Total Gym Admins
- Active Administrators
- Inactive Administrators

### Platform Users & Resources
- Total Members
- Total Staff
- Trainers
- Receptionists

### Platform Summary
- Gym Availability (active / total)
- Administrator Availability (active / total)
- Platform Members
- Platform Staff

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/platform/stats` | Get platform statistics | Super Admin |

---

# 👥 Staff Management Module

The Staff Management module is implemented for the Gym Admin dashboard.

## Completed Features

- View all staff
- Create Receptionist
- Create Trainer
- Edit staff
- Update staff role
- Update staff email
- Update staff password
- Activate/deactivate staff
- Delete staff
- Email uniqueness validation (gym-scoped)
- Password hashing (bcrypt)
- Role validation (receptionist, trainer only)
- Admin-only staff management
- Loading states
- Error handling
- Empty states
- Delete confirmation
- Dynamic staff information
- Role-based UI

Only users with the admin role can access Staff Management.

## Staff Management API

```
GET     /api/staff              → Get all staff (admin only)
GET     /api/staff/trainers     → Get all trainers (admin, receptionist)
POST    /api/staff              → Create staff (admin only)
PUT     /api/staff/:id          → Update staff (admin only)
DELETE  /api/staff/:id          → Delete staff (admin only)
```

All Staff Management endpoints are protected:

```
protect
   ↓
authorize("admin")
   ↓
Controller
```

## Staff Data Model

Staff accounts use the existing **User model** with `gymId` set to the admin's gym.

Supported roles for staff: `receptionist`, `trainer`.

User records contain:

- Full Name
- Email (globally unique)
- Password (bcrypt hashed)
- Role
- gymId (links to Gym)
- createdBy (links to the Admin who created this account)
- Active Status
- Created At / Updated At

## Staff Security

Staff creation follows this process:

```
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
Email Validation (gym-scoped)
      ↓
Password Hashing (bcrypt)
      ↓
MongoDB (with gymId from req.user)
```

---

# 💳 Membership Plans Module

The Membership Plans module is implemented for the Gym Admin dashboard.

## Completed Features

- View all membership plans (gym-scoped)
- Search membership plans
- Create membership plan
- Edit membership plan
- Delete membership plan
- Delete confirmation
- Membership plan status
- Plan duration
- Plan pricing
- Plan description
- Plan features
- Loading states
- Error states
- Empty states
- Reusable DataTable
- Reusable Modal
- Reusable Button
- Status badges
- Feature preview
- Animated feature popup

Membership Plan configuration is currently an Admin-only operation.

## Membership Plans API

```
GET     /api/membership-plans          → Get all plans
GET     /api/membership-plans/:id      → Get single plan
POST    /api/membership-plans          → Create plan (admin only)
PUT     /api/membership-plans/:id      → Update plan (admin only)
DELETE  /api/membership-plans/:id      → Delete plan (admin only)
```

All plan operations are **gym-scoped** — plans from one gym cannot be accessed by another gym.

## Membership Plan Data Model

| Field | Type | Description |
|---|---|---|
| gymId | ObjectId (required) | Owning gym |
| planName | String (required) | Plan name |
| durationInMonths | Number (min: 1) | Duration in months |
| price | Number (min: 0) | Plan price |
| description | String | Plan description |
| features | [String] | Plan feature list |
| isActive | Boolean (default: true) | Plan status |
| timestamps | — | createdAt, updatedAt |

Compound unique index: `{ gymId, planName }` — same plan name allowed across different gyms, but not inside the same gym.

---

# 👥 Members Module

The Members module includes full backend CRUD with gym-scoped data isolation.

## Completed Backend APIs

```
GET     /api/members           → Get all members
GET     /api/members/:id       → Get single member
POST    /api/members           → Create member
PUT     /api/members/:id       → Update member
DELETE  /api/members/:id       → Delete member
```

## Current Permissions

```
View Members
    │
    ├── Admin
    ├── Receptionist
    └── Trainer (assigned members only)

Create / Update Members
    │
    ├── Admin
    └── Receptionist

Delete Members
    │
    └── Admin
```

## Gym-Scoped Member Uniqueness

When creating or updating a member, the system validates uniqueness **within the gym only**:

- **Member ID** — must be unique within the gym
- **Email** — must be unique within the gym (also checked against Users collection)
- **CNIC** — must be unique within the gym
- **Phone Number** — must be unique within the gym

The same email, CNIC, or phone number can exist in different gyms.

## Membership Expiry Calculation

When a member is created or their plan/joining date changes:

1. The membership plan's `durationInMonths` is retrieved
2. The expiry date is calculated from the joining date + duration
3. The expiry date is stored as `membershipExpiryDate`

## Trainer Member Filtering

When a Trainer calls `GET /api/members`, they only see members where `assignedTrainer` matches their user ID. Admins and Receptionists see all members in their gym.

---

# 🔔 Membership Expiry Notifications

GymFlow CRM includes membership expiry notifications.

## Frontend Notifications

The system checks membership expiry dates and generates alerts for:

- Expired memberships
- Memberships expiring today
- Memberships expiring tomorrow
- Memberships expiring within 3 days
- Memberships expiring within 7 days

Notifications are displayed in the dashboard Navbar.

## Backend API

```
GET     /api/membership-reminders/expiry-alerts   → Get expiry alerts
```

Protected by `authorize("admin", "receptionist")`.

The API returns a list of members with expiring or expired memberships, including:
- Member name, email, phone
- Membership plan name
- Expiry date
- Days remaining
- Alert type (expired, urgent, warning)
- Human-readable message

---

# 🔗 Backend API Routes Summary

## Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register (disabled — returns 403) | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/users` | Get all users (gym-scoped) | Admin |

## Gyms

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/gyms` | Get all gyms | Super Admin |
| GET | `/api/gyms/:id` | Get single gym | Super Admin |
| POST | `/api/gyms` | Create gym + admin | Super Admin |
| PUT | `/api/gyms/:id` | Update gym | Super Admin |
| PATCH | `/api/gyms/:id/status` | Toggle gym status | Super Admin |

## Gym Administrators

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/gym-admins` | Get all gym admins | Super Admin |
| GET | `/api/gym-admins/:id` | Get single gym admin | Super Admin |
| PATCH | `/api/gym-admins/:id/status` | Toggle admin status | Super Admin |

## Platform

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/platform/stats` | Get platform statistics | Super Admin |

## Members

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/members` | Get all members | Admin, Receptionist, Trainer |
| GET | `/api/members/:id` | Get single member | Admin, Receptionist, Trainer |
| POST | `/api/members` | Create member | Admin, Receptionist |
| PUT | `/api/members/:id` | Update member | Admin, Receptionist |
| DELETE | `/api/members/:id` | Delete member | Admin |

## Membership Plans

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/membership-plans` | Get all plans | Admin, Receptionist, Trainer |
| GET | `/api/membership-plans/:id` | Get single plan | Admin, Receptionist, Trainer |
| POST | `/api/membership-plans` | Create plan | Admin |
| PUT | `/api/membership-plans/:id` | Update plan | Admin |
| DELETE | `/api/membership-plans/:id` | Delete plan | Admin |

## Membership Reminders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/membership-reminders/expiry-alerts` | Get expiry alerts | Admin, Receptionist |

## Staff

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/staff` | Get all staff | Admin |
| GET | `/api/staff/trainers` | Get all trainers | Admin, Receptionist |
| POST | `/api/staff` | Create staff | Admin |
| PUT | `/api/staff/:id` | Update staff | Admin |
| DELETE | `/api/staff/:id` | Delete staff | Admin |

---

# 🧪 Backend Testing

Backend APIs are being tested using Postman during development.

Testing includes:

- JWT Authentication
- Protected Routes
- Role-Based Access Control
- CRUD Operations
- Request Validation
- Authorization Errors
- API Responses

Frontend-to-backend integration testing is also performed through the actual application.

---

# 🔄 Application Architecture

```
Next.js Frontend
       │
       ▼
Frontend Services (api.js, authService.js, etc.)
       │
       ▼
REST API (fetch with JWT Bearer token)
       │
       ▼
Express Routes (server.js)
       │
       ▼
protect Middleware (JWT verification)
       │
       ▼
authorize() Middleware (role checking)
       │
       ▼
Controllers (business logic + gymId scoping)
       │
       ▼
Mongoose Models (schema validation + compound indexes)
       │
       ▼
MongoDB (multi-tenant data)
```

---

# 🗺️ Development Roadmap

## PHASE 1 — FOUNDATION ✅

- Project Setup ✅
- Frontend Setup ✅
- Backend Setup ✅
- MongoDB Integration ✅
- Authentication ✅
- JWT Authentication ✅
- RBAC ✅
- Backend Foundation ✅

## PHASE 2 — ADMIN MODULE

- Admin Dashboard ✅ (basic — hardcoded stats, needs dynamic data)
- Membership Plans ✅
- Members Module ✅
- Staff Management ✅
- Attendance ⏳ (model exists, no controller/frontend)
- Payments ⏳
- Reports ⏳
- Settings ⏳

## PHASE 3 — RECEPTIONIST MODULE

- Receptionist Dashboard ✅
- Member Operations ✅
- Membership Operations N/A
- Attendance ⏳
- Payments N/A
- Appointments N/A

## PHASE 4 — TRAINER MODULE

- Trainer Dashboard ✅
- Assigned Members ✅
- Workout Plans N/A
- Member Progress N/A
- Trainer Attendance N/A
- Appointments N/A

## PHASE 5 — SUPER ADMIN ✅

- Super Admin Dashboard ✅
- Gym Management (CRUD) ✅
- Gym Administrator Management ✅
- Platform Administration (Statistics) ✅
- Platform Analytics ✅

## PHASE 6 — SaaS

- Multi-Tenant Architecture ✅
- Tenant Data Isolation ✅
- Gym-Scoped Uniqueness (Compound Indexes) ✅
- Gym Status Management ✅
- Production Deployment ⏳

---

# 🎯 Project Goal

The goal of GymFlow CRM is to be a production-ready SaaS platform where:

**Platform Owner (Super Admin) manages:**
- Gyms / Tenants
- Gym Admin Accounts
- Platform-wide Statistics
- Platform Administration

**Each Gym independently manages:**
- Members
- Membership Plans
- Trainers
- Receptionists
- Attendance
- Payments
- Gym Operations

---

# 👨‍💻 Developer

Abdul Majid Khan

Software Engineering Student

Building GymFlow CRM as a Production-Level SaaS Application.
