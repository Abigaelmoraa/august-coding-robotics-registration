# August Coding & Robotics Program — Registration System

A complete online registration system for the August Coding & Robotics Program for children and teenagers. Parents can register students online, receive a confirmation with a unique registration number, and administrators can manage all registrations from a protected dashboard.

## Features

**Public registration**
- Multi-section form: student info, parent/guardian info, program, level, schedule
- Client-side validation (Zod + react-hook-form) with clear error messages
- Server-side validation via database constraints and RLS policies
- Auto-generated registration number on success (`ACR-YYYYMMDD-XXXXXX`)
- Confirmation page with the registration number

**Admin dashboard** (`/admin`)
- Email/password authentication
- Role-based access — only users with the `admin` role see the dashboard
- View all registrations
- Search by student name, parent name, email, or registration number
- Filter by program, area of residence, and age range
- Edit and delete registrations
- Export filtered results to CSV
- At-a-glance stats

## Tech Stack

- **Frontend:** React 19, TanStack Start (Router + Query), TypeScript, Tailwind CSS v4, shadcn/ui, Vite
- **Backend / DB:** Lovable Cloud (managed Supabase) — PostgreSQL, Auth, Row-Level Security
- **Forms & validation:** react-hook-form + Zod
- **Deployment:** Managed by Lovable (Cloudflare Workers edge runtime)

## Database Design

Two tables in the `public` schema:

**`registrations`**
- `id` (UUID, PK), `registration_number` (unique, auto-generated)
- Student: `student_full_name`, `student_age`, `student_grade`, `school_name`, `gender` (nullable), `area_of_residence`, `emergency_contact` (nullable), `additional_notes` (nullable)
- Parent: `parent_name`, `parent_phone`, `parent_email`
- Program: `program` (enum: coding / robotics / coding_robotics), `level` (enum: beginner / intermediate / advanced)
- Schedule: `session_pref` (enum: morning / afternoon / evening), `preferred_days` (text[]), `preferred_start_date`
- Timestamps: `created_at`, `updated_at`

**`user_roles`**
- `user_id` (references `auth.users`), `role` (enum: `admin` | `user`)
- Roles are stored separately from profiles to prevent privilege escalation
- `has_role(user_id, role)` security-definer function used inside RLS policies

**Row-Level Security**
- Anonymous users can `INSERT` new registrations (public form)
- Only admins can `SELECT`, `UPDATE`, `DELETE` registrations
- The first user to sign up is automatically granted the `admin` role (bootstrap trigger)

## Local Setup

```bash
bun install
bun run dev
```

Open `http://localhost:8080`.

The backend is provisioned on Lovable Cloud. Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) are injected automatically.

## Deployment

Deploys automatically to Lovable's edge hosting (Cloudflare Workers) — click **Publish** in the Lovable editor.

## First-Time Admin Setup

1. Open `/auth`
2. Create an account — the first account created is automatically granted admin role
3. You'll be redirected to `/admin`

## AI Tools Used

Built with **Lovable** (AI-assisted development).

## Assumptions

- The first signup is the seed admin. Additional admins can be granted via the database.
- Email confirmation is off by default for admin signup during evaluation; can be enabled in Lovable Cloud auth settings.
- Ages 4–19 are accepted.
