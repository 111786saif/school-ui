# School Management System

# Test

This project is a comprehensive School Management System built with **React**, **TypeScript**, and **Vite**.

It uses a standardized architecture for state management, data fetching, and form handling to ensure scalability and maintainability.

## 🚀 Tech Stack & Key Decisions

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Redux Toolkit (RTK)](https://redux-toolkit.js.org/)
    - Used for global client state (e.g., User Session, UI Toggles).
- **Data Fetching:** [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
    - Replaces manual `axios` + `useEffect`. Handles caching, loading states, and auto-refetching.
- **Forms:** [React Hook Form](https://react-hook-form.com/)
    - Efficient, validation-ready form handling using a standardized `<Form />` wrapper.
- **Routing:** [React Router DOM v7](https://reactrouter.com/)

---

## 📂 Folder Structure Explained

The project follows a **Feature-Based Architecture**. This means code is organized by "business features" (like Auth, Dashboard, Students) rather than technical type (Components, Hooks).

```text
src/
├── assets/             # Static assets (images, svg, global fonts)
├── components/         # SHARED components used across multiple features
│   ├── layout/         # Layout components (Sidebar, Header, MainLayout)
│   └── ui/             # Reusable UI primitives (Buttons, Inputs, Cards, Form wrapper)
├── context/            # Legacy Context API files (migrating to Redux)
├── features/           # 🌟 MAIN APPLICATION LOGIC
│   ├── auth/           # Authentication feature (Login, Logout logic)
│   ├── dashboard/      # Dashboard feature
│   ├── front-office/   # Front Office management (Visitors, Enquiries)
│   └── peoples/        # Staff and Student management
├── hooks/              # Global custom hooks (useDebounce, useOnClickOutside)
├── services/           # External service configurations (Axios config)
├── store/              # 🌟 REDUX STORE SETUP
│   ├── apiSlice.ts     # Base RTK Query API definition
│   ├── hooks.ts        # Typed hooks (useAppDispatch, useAppSelector)
│   └── store.ts        # Main store configuration
├── types/              # Global TypeScript definitions
├── App.tsx             # Main App component
└── main.tsx            # Entry point (Providers setup)
```

---

## 🛠️ How to Use (Standardized Workflow)

### 1. State Management (Redux)
Don't use `useDispatch` or `useSelector` directly. Use the typed hooks.

```tsx
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../features/auth/authSlice';

const UserProfile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Hello, {user?.name}</h1>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};
```

### 2. Data Fetching (RTK Query)
To fetch data, define an endpoint in a feature's API slice (e.g., `features/students/studentApiSlice.ts`) and inject it into the base `apiSlice`.

**Example Definition:**
```typescript
// features/students/studentApiSlice.ts
import { apiSlice } from '../../store/apiSlice';

export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => '/students',
    }),
  }),
});

export const { useGetStudentsQuery } = studentApiSlice;
```

**Example Usage:**
```tsx
import { useGetStudentsQuery } from '../../features/students/studentApiSlice';

const StudentList = () => {
  const { data: students, isLoading } = useGetStudentsQuery({});

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {students.map(student => <li key={student.id}>{student.name}</li>)}
    </ul>
  );
};
```

### 3. Forms (React Hook Form)
Use the standardized `<Form />` component located in `src/components/ui/Form.tsx`.

```tsx
import { Form } from '../../components/ui/Form';
import { Input } from '../../components/ui/Input';

interface LoginData {
  email: string;
}

const LoginForm = () => {
  const handleSubmit = (data: LoginData) => {
    console.log("Form Submitted:", data);
  };

  return (
    <Form<LoginData> 
      onSubmit={handleSubmit}
      options={{ defaultValues: { email: '' } }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <label>Email</label>
          <input {...register('email', { required: true })} />
          {errors.email && <span>Email is required</span>}
          
          <button type="submit">Login</button>
        </>
      )}
    </Form>
  );
};
```

## ⚠️ Important Rules

1.  **Strict Typing:** Always define interfaces for your API responses and Component props.
2.  **Feature Isolation:** Try to keep files related to a specific feature (like "Front Office") inside that feature's folder. Only move them to `src/components` if they are truly generic and used everywhere.
3.  **Redux Slices:** Create new slices only for global state. For local component state (like "is dropdown open"), stick to `useState`.
