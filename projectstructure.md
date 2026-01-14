# Project Structure & Architecture Guide

This document explains the organization of the **School Management System** codebase. The project follows a **Feature-Based Architecture**, where code is grouped by business domain (e.g., Auth, Dashboard, Front Office) rather than by technical type.

---

## 📂 Root Directory (`src/`)

### `assets/`
*   Stores static assets like images, global SVGs, and fonts.
*   **Example:** `react.svg`, `logo.png`.

### `components/`
*   **Shared UI Components** used across multiple features.
*   **`layout/`**: Structural components like `MainLayout`, `Sidebar`, `Header`.
*   **`ui/`**: Reusable "dumb" components like `Button`, `Card`, `Input`, `PageHeader`.
*   **Why?** If a button design changes, you update it here once, and it reflects everywhere.

### `context/`
*   React Context Providers for global application state that doesn't fit into Redux or needs simpler access.
*   **`AuthContext.tsx`**: Wraps the Redux auth logic to provide a simple `useAuth()` hook for components.
*   **`ThemeContext.tsx`**: Manages Light/Dark mode toggling.

### `features/` (The Core)
This is where 90% of the application logic lives. Each folder represents a distinct module of the school system.

#### 1. `auth/` (Authentication)
*   **`authSlice.ts`**: Redux logic for login state & token management.
*   **`pages/LoginPage.tsx`**: The login screen UI.

#### 2. `dashboard/` (Home)
*   **`pages/DashboardPage.tsx`**: The main landing page after login, showing widgets and stats.

#### 3. `front-office/` (Reception Module)
*   **`pages/`**:
    *   **`AdmissionEnquiryPage`**: Manage new student leads.
    *   **`AddVisitorPage`**: Log new visitors at the gate.
    *   **`PhoneCallLogPage`**: Track incoming/outgoing calls.
    *   **`PostalLogPage`**: Track dispatched/received mail.
    *   **`ComplaintsPage`**: Log and track parent/staff complaints.
    *   **`FrontOfficeSetupPage`**: Configure visitor purposes, complaint types, etc.

#### 4. `peoples/` (User Management)
*   **`pages/`**:
    *   **`StudentsPage`**: Master list of all students.
    *   **`AddStudentPage`**: Complex multi-step form for new admissions.
    *   **`ParentsPage`**: List of guardians linked to students.
    *   **`StaffPage`**: Manage teachers, admins, and support staff.
    *   **`PromoteStudentPage`**: Tool to bulk-move students to the next class.
    *   **`RollNumbersPage`**: Tool to assign/update roll numbers for a class.

### `hooks/`
*   Custom React Hooks for reusable logic.
*   **Example:** `useOnClickOutside`, `useWindowSize`.

### `services/`
*   **API Communication Layer**. All `fetch` or `axios` calls happen here.
*   **`api.ts`**: The base Axios instance with interceptors (adds Token to headers automatically).
*   **`authService.ts`**: specialized calls for Login/Register.

### `store/`
*   **Redux Configuration**.
*   **`store.ts`**: The central store setup combining all slices.
*   **`hooks.ts`**: Typed versions of `useDispatch` and `useSelector`.

### `types/`
*   **TypeScript Definitions**.
*   **`index.ts`**: Shared interfaces like `User`, `Student`, `Staff` to ensure type safety across the app.

### `utils/`
*   **Helper Functions**.
*   **`storage.ts`**: A wrapper for `localStorage` to safely manage tokens and user sessions.

---

## 🛠 Key Files in Root

*   **`App.tsx`**: The main entry point. Sets up the Router and Providers.
*   **`main.tsx`**: Mounts the React app to the DOM.
*   **`vite-env.d.ts`**: Type definitions for Vite environment variables.

## 📐 Design Philosophy

1.  **Colocation:** If a style (`.module.css`) is only used by one page, keep it right next to that page component.
2.  **Separation of Concerns:**
    *   **UI** goes in `pages/` or `components/`.
    *   **State** goes in `store/` or `slices`.
    *   **Data Fetching** goes in `services/`.
3.  **Modular:** You can delete the `front-office` folder, and the rest of the app (Student Management, Auth) will still work fine. This makes the app scalable.
