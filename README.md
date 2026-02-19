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

## ⚙️ How MediFlow Works

MediFlow follows a **role-based workflow** where each user type interacts with the platform differently:

### 1. Sign Up & Role Selection
- Visit `/signup` and create an account by choosing your role: **Patient**, **Doctor**, or **Admin**.
- After email verification, log in at `/login`. You're automatically redirected to your role-specific dashboard.

### 2. Patient Workflow
```
Sign Up → Find a Doctor → Book Appointment → Attend Consultation
→ Receive Prescription → Order Medicines from Pharmacy
→ View Lab Reports & Health Records
```
1. **Find & Book**: Search doctors by specialty, availability, or rating. View profiles and book In-Person or Video appointments with a preferred time slot.
2. **Consultations**: Attend scheduled Video or Audio consultations. View history and ratings.
3. **Prescriptions**: After a consultation, doctors issue prescriptions. Patients can view active medications, dosage, and refill status.
4. **Pharmacy**: Browse the medicine catalog, add items to cart, and place orders. Track order status (Pending → Shipped → Delivered).
5. **Lab Reports**: View results uploaded by doctors, with status indicators (Normal / Abnormal) and alerts for out-of-range values.
6. **Health Records**: Access a complete medical history including diagnoses, treatments, and visit summaries.

### 3. Doctor Workflow
```
Log In → View Today's Schedule → Manage Appointments
→ Write Prescriptions → Upload Lab Reports → Manage Patient Records
```
1. **Dashboard**: See today's appointments, patient stats, and quick actions.
2. **Appointments**: Accept, complete, or cancel patient appointments. Filter by status or date.
3. **Patients**: View an aggregated list of all patients with their visit history.
4. **Prescriptions**: Create new prescriptions with medications, dosage, frequency, and instructions.
5. **Lab Reports & Health Records**: Upload and manage lab results and patient medical records.
6. **Consultations**: Schedule and manage Video/Audio consultations.

### 4. Admin Workflow
```
Log In → Monitor Clinic KPIs → Manage Doctors & Patients
→ Oversee Appointments → Manage Medicine Inventory → Track Orders
```
1. **Dashboard**: Clinic-wide overview with KPIs — total doctors, patients, appointments, and revenue.
2. **User Management**: Add, edit, or deactivate doctor and patient accounts.
3. **Appointments**: View and manage all clinic appointments across doctors.
4. **Medicines**: Maintain the medicine catalog — add new medicines, update stock, set pricing.
5. **Orders**: Track all pharmacy orders and update their fulfillment status.
6. **Access Control**: Manage role-based permissions for all users.

### 5. Data Security
- **Row Level Security (RLS)**: Every table enforces policies so users only see their own data.
- **Role-based routing**: Protected routes prevent unauthorized access (e.g., patients can't access admin pages).
- **Authentication**: All API calls require a valid session token.

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
