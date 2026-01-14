# Professional API Architecture Blueprint

This document outlines the **Market Standard** approach for organizing API logic in a large-scale React application.

## 1. The Core Philosophy: "The Service Layer"

In professional engineering, UI components should **never** know about HTTP details (URLs, Headers, GET/POST). They should only ask for data.

**The Golden Rule:**
> *Components Render. Services Fetch. Store Caches.*

## 2. Recommended Directory Structure

We split services by **Domain** (Business Feature), not by technical type.

```text
src/
├── services/
│   ├── config/
│   │   ├── axiosInstance.ts    # The Single Source of Truth for HTTP (BaseURL, Interceptors)
│   │   └── endpoints.ts        # (Optional) Central list of all URL strings
│   │
│   ├── auth/                   # Domain: Authentication
│   │   ├── auth.service.ts     # The actual API calls (login, register)
│   │   └── auth.types.ts       # Request/Response TypeScript interfaces
│   │
│   ├── students/               # Domain: Student Management
│   │   ├── students.service.ts
│   │   └── students.types.ts
│   │
│   ├── finance/                # Domain: Finance
│   │   └── ...
│   │
│   └── index.ts                # Barrel export for cleaner imports
```

---

## 3. Implementation Blueprint

### A. The Core Axios Instance (`src/services/config/axiosInstance.ts`)
This is the **engine**. It handles the repetitive work automatically.

```typescript
import axios from 'axios';
import { storage } from '../../utils/storage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// 1. Request Interceptor (Auto-inject Token)
apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor (Global Error Handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout user if token is expired
      storage.clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### B. The Feature Service (`src/services/students/students.service.ts`)
This contains the **business operations**.

```typescript
import apiClient from '../config/axiosInstance';
import { Student, CreateStudentDTO } from './students.types';

export const StudentService = {
  getAll: async (classId?: string) => {
    const params = classId ? { classId } : {};
    const response = await apiClient.get<Student[]>('/students', { params });
    return response.data;
  },

  create: async (data: CreateStudentDTO) => {
    const response = await apiClient.post<Student>('/students', data);
    return response.data;
  },

  promote: async (studentIds: string[], targetClass: string) => {
    return apiClient.post('/students/promote', { ids: studentIds, targetClass });
  }
};
```

---

## 4. Integration with State Management (Redux)

For large applications, you have two main professional choices:

### Option A: Redux Toolkit Async Thunks (Standard)
Best for complex logic where you need full control over the data flow.

```typescript
// src/features/students/studentSlice.ts
export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (classId, thunkAPI) => {
    try {
      return await StudentService.getAll(classId); // Uses the service we made above
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
```

### Option B: RTK Query (Advanced / Modern)
Best for reducing boilerplate. It replaces the "Service Layer" files with "API Slices".

```typescript
// src/services/apiSlice.ts
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: (classId) => `/students?class=${classId}`,
    }),
  }),
});
```

**Recommendation for You:** Stick to **Option A (Service Layer + Thunks)** for now. It is easier to debug, clearer to read, and decouples your API logic from Redux, giving you flexibility to switch state managers later if needed.

---

## 5. Pros & Cons Analysis (Large Scale Apps)

### Advantages (Why Professionals do this)
1.  **Centralized Control:** If the backend authentication method changes (e.g., from Bearer Token to Cookies), you change **one file** (`axiosInstance.ts`), and the whole app is updated.
2.  **Mocking & Testing:** It is incredibly easy to mock `StudentService` for unit tests without needing to mock the entire HTTP library or Redux store.
3.  **Code Splitting:** Services are just JavaScript functions. They are lightweight and don't bloat your bundle size.
4.  **Type Safety:** By defining DTOs (Data Transfer Objects) in `students.types.ts`, you ensure that the Frontend and Backend agree on the data structure.

### Disadvantages (Trade-offs)
1.  **Boilerplate:** You have to create a file for every feature. For a tiny app, this is overkill.
2.  **Prop Drilling:** If you don't use Redux, you have to pass the data down manually or use many hooks.

## 6. Summary

For your **School Management System**, adopting the **Service Layer Pattern** (Option A) is the correct strategic move. It keeps your code:
*   **Clean:** UI components look like UI, not logic.
*   **Safe:** Auth tokens are handled automatically.
*   **Scalable:** Adding "Teachers", "Transport", "Library" modules just means adding new folders in `src/services/`.
