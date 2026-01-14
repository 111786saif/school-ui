# Modular "Plug & Play" Architecture Blueprint

This document outlines the architecture for a scalable, sellable SaaS application where features (modules) can be enabled, disabled, or removed completely without breaking the core application.

## 1. The Core Philosophy: "Self-Contained Modules"

Instead of organizing by technical layer (e.g., "All APIs in one folder"), we organize by **Business Value**.

**Rule:** If I delete the `src/modules/fees` folder, the app should still build and run (minus the Fee features).

## 2. Directory Structure

We split the application into **Kernel (Core)** and **Modules (Plugins)**.

```text
src/
├── kernel/                     # THE CORE (Cannot be removed)
│   ├── auth/                   # Authentication logic
│   ├── ui/                     # Shared UI Components (Buttons, Cards)
│   ├── http/                   # The Core Axios Instance (Interceptors)
│   └── store/                  # The Root Redux Store
│
├── modules/                    # THE PLUGINS (Enable/Disable these)
│   │
│   ├── fees/                   # 💰 FEE MODULE
│   │   ├── api/                # API calls SPECIFIC to fees
│   │   │   ├── feeService.ts
│   │   │   └── feeTypes.ts
│   │   ├── pages/              # Fee Pages
│   │   ├── components/         # Fee-specific components
│   │   ├── fee.routes.tsx      # Routes for this module
│   │   └── index.ts            # The "Public Interface" of the module
│   │
│   ├── library/                # 📚 LIBRARY MODULE
│   │   ├── api/
│   │   └── ...
│   │
│   └── transport/              # 🚌 TRANSPORT MODULE
│       └── ...
│
└── moduleRegistry.ts           # 🎛️ The Switchboard (Plug/Unplug here)
```

---

## 3. The API Strategy for Modular Apps

### A. The Core HTTP Client (`src/kernel/http/apiClient.ts`)
The `kernel` provides the *tool* to make requests, but knows nothing about specific URLs.

```typescript
// src/kernel/http/apiClient.ts
import axios from 'axios';
// ... configuration (BaseURL, Interceptors) ...
export default apiClient;
```

### B. The Module API (`src/modules/fees/api/feeService.ts`)
The module imports the tool from the kernel.

```typescript
import apiClient from '../../../kernel/http/apiClient';

export const FeeService = {
  getPendingDues: (studentId: string) => 
    apiClient.get(`/modules/fees/pending/${studentId}`),
    
  generateInvoice: (data: any) => 
    apiClient.post('/modules/fees/invoice', data)
};
```

**Why this is professional:**
If you delete the `src/modules/fees` folder to sell a "Lite Version", `feeService.ts` disappears with it. If you had put it in a global `src/services` folder, you would have dead code calling a module that doesn't exist.

---

## 4. The "Switchboard" (How to Plug/Unplug)

You need a central file that imports all modules. This is the **ONLY** place the Core touches the Modules.

### The Module Interface
Every module must export a standard object:

```typescript
// src/modules/fees/index.ts
import { FeeRoutes } from './fee.routes';
import { FeeSidebarItem } from './fee.nav';

export const FeeModule = {
  id: 'fees',
  isEnabled: true, // or check a license key
  routes: FeeRoutes,
  navItem: FeeSidebarItem,
};
```

### The Registry (`src/moduleRegistry.ts`)

```typescript
// To UNPLUG a module, simply comment out the import!

import { FeeModule } from './modules/fees';
import { LibraryModule } from './modules/library';
// import { TransportModule } from './modules/transport'; // <--- UNPLUGGED

export const appModules = [
  FeeModule,
  LibraryModule,
  // TransportModule
];
```

---

## 5. Dynamic Runtime "Unplugging" (License Based)

If you sell the *same* codebase but want to restrict features based on the user's subscription (SaaS), you handle this in the Sidebar/Router.

```typescript
// In your Sidebar component
{appModules.map(module => {
  // Check if the logged-in school has paid for this module
  if (!user.licenses.includes(module.id)) return null;

  return <SidebarItem item={module.navItem} />;
})}
```

---

## 6. Pros & Cons of this Architecture

### Advantages (Why it sells)
1.  **Sales Flexibility:** You can easily package different versions of your software (Lite, Standard, Enterprise) by simply excluding folders during the build or toggling the registry.
2.  **Team Scalability:** Developer A works on `fees`, Developer B works on `library`. They never touch the same files.
3.  **Safety:** A bug in the `Transport` module cannot break the `Auth` system, because dependencies only flow one way (Module -> Kernel).

### Disadvantages
1.  **Initial Setup:** It takes more time to set up the `kernel` and `registry` than just throwing everything in one folder.
2.  **Strict Discipline:** Developers must not import `FeeService` inside `LibraryPage`. Modules should not talk to each other directly (they should communicate via the Kernel or Event Bus).

## Summary
For a commercial, modular product:
**Move APIs INSIDE their respective Module folders.** Do not keep a global `services` folder for feature-specific logic.
