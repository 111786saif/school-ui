# Current Project Structure Blueprint

This document represents the snapshot of the **School Management System** as of **January 2026**.
The project currently follows a **Feature-Based Architecture**.

---

## 📂 Root Directory (`src/`)

### `features/`
The core business logic is grouped by domain here.

#### 1. `auth/` (Authentication)
*   **`authSlice.ts`**: Redux state management for user sessions.
*   **`components/`**:
    *   `LoginHeader.tsx`
    *   `LoginForm.tsx`
    *   `LoginFooter.tsx`
*   **`pages/`**:
    *   `LoginPage.tsx`: The main container for the login view.

#### 2. `dashboard/` (Home)
*   **`pages/`**:
    *   `DashboardPage.tsx`: The landing page with widgets.

#### 3. `front-office/` (Reception Module)
*   **`pages/`**:
    *   `AdmissionEnquiryPage.tsx`: Managing leads.
    *   `AddVisitorPage.tsx` / `VisitorsLogPage.tsx`: Visitor management.
    *   `PhoneCallLogPage.tsx`: Call tracking.
    *   `PostalLogPage.tsx`: Mail tracking.
    *   `ComplaintsPage.tsx`: Issue tracking.
    *   `FrontOfficeSetupPage.tsx`: Configuration.

#### 4. `peoples/` (User Management)
*   **`pages/`**:
    *   `StudentsPage.tsx` / `AddStudentPage.tsx`: Student CRUD.
    *   `StaffPage.tsx` / `AddStaffPage.tsx`: Staff CRUD.
    *   `ParentsPage.tsx`: Guardian management.
    *   `PromoteStudentPage.tsx`: Bulk promotion tool.
    *   `RollNumbersPage.tsx`: Roll number assignment tool.

### `services/`
*   **`api.ts`**: The core Axios instance with interceptors.
*   **`authService.ts`**: API calls for Login/Register.
*   *(Note: API calls for Students, Staff, etc. are currently inside their respective components or mock data, pending refactor to this folder)*

### `context/`
*   **`AuthContext.tsx`**: A wrapper around Redux to provide `useAuth()` hook.
*   **`ThemeContext.tsx`**: UI Theme management.

### `store/`
*   **`store.ts`**: Redux Store configuration.
*   **`hooks.ts`**: Typed Redux hooks.

### `utils/`
*   **`storage.ts`**: LocalStorage abstraction wrapper.

### `components/`
*   **`layout/`**: `Sidebar`, `Header`, `MainLayout`.
*   **`ui/`**: Reusable atoms like `Button`, `Card`, `Input`.

---

## 🔍 Analysis of Current State

### Strengths
1.  **Logical Grouping:** Features are clearly separated in the `features/` folder.
2.  **Modern Auth:** Authentication is robust, using Redux + LocalStorage with a clean Service Layer.
3.  **UI Consistency:** Reusable UI components are being used (e.g., `Card`, `PageHeader`).

### Areas for Evolution (To Reach "Plug & Play" Goal)
1.  **API Dispersion:** Currently, `front-office` and `peoples` logic is likely mixed inside the `pages/*.tsx` files. To enable "unplugging" these modules, their data fetching logic needs to move into dedicated API files (e.g., `src/features/peoples/api/studentService.ts`).
2.  **Hard Links:** If the Sidebar imports `StudentsPage` directly, removing the `peoples` folder will break the build. We need to introduce a "Registry" pattern (as outlined in `modular_architecture.md`) to decouple them.
