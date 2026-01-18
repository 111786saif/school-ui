export interface BackendUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string | null;
  status: string;
  role: string; // Required as per API response
  is_super_admin: boolean;
  permissions: string[];
  created_at?: string;
}

export interface User extends BackendUser {
  name: string; // Derived field for UI compatibility
  token?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: BackendUser;
}

// --- Auth Request DTOs ---

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// --- Admin/RBAC DTOs ---

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Permission {
  id: string;
  code: string;
  module: string;
  description?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface CreatePermissionRequest {
  code: string;
  module: string;
  description?: string;
}

export interface AssignRolesRequest {
  userId: string;
  roleIds: string[];
}

export interface AssignPermissionsRequest {
  roleId: string;
  permissionIds: string[];
}
