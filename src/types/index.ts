export interface BackendUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  status?: string;
  role?: string;
}

export interface User extends BackendUser {
  name: string; // Derived field for UI compatibility
  token?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: BackendUser;
}
