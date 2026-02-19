# MediFlow – HealthTech SaaS Platform

MediFlow is a comprehensive healthcare management platform built for **Patients**, **Doctors**, and **Clinic Admins**. It streamlines appointments, consultations, prescriptions, lab reports, and pharmacy orders in one unified interface.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm or [bun](https://bun.sh/)

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🏗 Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React 18, Vite, TypeScript        |
| Styling    | Tailwind CSS, shadcn/ui           |
| Animations | Framer Motion                     |
| Routing    | React Router v6                   |
| Data       | TanStack React Query + Supabase   |
| Auth       | Supabase Auth (email/password)    |
| Backend    | Supabase (Postgres, Edge Functions, Storage) |

---

## 👥 User Roles

### Patient
| Feature           | Route                     | Description                                      |
| ----------------- | ------------------------- | ------------------------------------------------ |
| Dashboard         | `/patient/dashboard`      | Health overview, upcoming appointments, quick actions |
| Find Doctors      | `/patient/doctors`        | Search, filter, and book appointments with doctors |
| Doctor Profile    | `/patient/doctors/:id`    | View doctor details and book a visit              |
| Appointments      | `/patient/appointments`   | View and manage all appointments                  |
| Consultations     | `/patient/consultations`  | Video/audio consultation history                  |
| Health Records    | `/patient/records`        | Browse personal medical history                   |
| Lab Reports       | `/patient/lab-reports`    | View lab results with status indicators           |
| Prescriptions     | `/patient/prescriptions`  | Active and past prescriptions with medications    |
| Pharmacy          | `/patient/pharmacy`       | Browse medicines, add to cart, place orders        |
| Profile           | `/patient/profile`        | Edit personal info and security settings          |

### Doctor
| Feature           | Route                      | Description                                     |
| ----------------- | -------------------------- | ----------------------------------------------- |
| Dashboard         | `/doctor/dashboard`        | Today's schedule, stats, upcoming appointments   |
| Appointments      | `/doctor/appointments`     | Search/filter/update appointment statuses         |
| My Patients       | `/doctor/patients`         | Aggregated patient list with visit history        |
| Prescriptions     | `/doctor/prescriptions`    | Create and manage prescriptions                   |
| Lab Reports       | `/doctor/lab-reports`      | Review patient lab results                        |
| Health Records    | `/doctor/health-records`   | Access patient medical records                    |
| Consultations     | `/doctor/consultations`    | Manage video/audio consultations                  |
| Profile           | `/doctor/profile`          | Edit specialty, bio, fee, and experience          |
| Settings          | `/doctor/settings`         | Account and notification preferences              |

### Admin
| Feature           | Route                      | Description                                     |
| ----------------- | -------------------------- | ----------------------------------------------- |
| Dashboard         | `/admin/dashboard`         | Clinic-wide KPIs, doctor list, recent orders      |
| Doctors           | `/admin/doctors`           | Manage all registered doctors                     |
| Patients          | `/admin/patients`          | View and manage patient accounts                  |
| Appointments      | `/admin/appointments`      | All appointments with status management           |
| Medicines         | `/admin/medicines`         | Inventory and medicine catalog management         |
| Orders            | `/admin/orders`            | Order tracking and status updates                 |
| Access Control    | `/admin/access-control`    | Role-based user access management                 |

---

## 🔐 Authentication

- **Sign Up** (`/signup`) – Create an account as Patient, Doctor, or Admin.
- **Login** (`/login`) – Email and password authentication.
- Role-based routing automatically redirects users to their respective dashboards.
- All dashboard routes are protected and require authentication.

---

## 📁 Project Structure

```
src/
├── assets/            # Images (hero, doctor avatars)
├── components/        # Shared components (DashboardLayout, NavLink, ProtectedRoute)
│   └── ui/            # shadcn/ui primitives
├── constants/         # Navigation config per role
├── contexts/          # AuthContext (user, role, session)
├── hooks/             # useSupabaseData, use-toast, use-mobile
├── integrations/      # Supabase client & generated types
├── pages/
│   ├── admin/         # Admin pages
│   ├── doctor/        # Doctor pages
│   └── patient/       # Patient pages
└── lib/               # Utility functions
supabase/
├── config.toml        # Supabase project config
└── functions/         # Edge functions (e.g. manage-users)
```

---

## 🗄 Database Schema

Key tables: `profiles`, `user_roles`, `doctors`, `appointments`, `consultations`, `prescriptions`, `prescription_medications`, `lab_reports`, `lab_report_results`, `health_records`, `medicines`, `orders`, `order_items`.

All tables use Row Level Security (RLS) to ensure users can only access their own data.

---

## 🧪 Running Tests

```bash
npm run test
```

---

## 📦 Deployment

This project is deployed via [Lovable](https://lovable.dev). Click **Publish** in the editor to deploy.

Custom domains can be configured in **Project → Settings → Domains**.

---

## 📄 License

Private project – all rights reserved.
