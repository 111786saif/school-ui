import api from '../../../services/apiClient';
import { 
  Role, 
  Permission, 
  CreateRoleRequest, 
  CreatePermissionRequest, 
  AssignRolesRequest, 
  AssignPermissionsRequest 
} from '../../../types';

export const adminService = {
  // --- Roles Management ---
  
  getAllRoles: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>('/admin/roles');
    return response.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await api.post<Role>('/admin/roles', data);
    return response.data;
  },

  assignRolesToUser: async (data: AssignRolesRequest): Promise<void> => {
    await api.post(`/admin/users/${data.userId}/roles`, { roleIds: data.roleIds });
  },

  // --- Permissions Management ---

  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await api.get<Permission[]>('/admin/permissions');
    return response.data;
  },

  createPermission: async (data: CreatePermissionRequest): Promise<Permission> => {
    const response = await api.post<Permission>('/admin/permissions', data);
    return response.data;
  },

  assignPermissionsToRole: async (data: AssignPermissionsRequest): Promise<void> => {
    await api.post(`/admin/roles/${data.roleId}/permissions`, { permissionIds: data.permissionIds });
  },

  getRolePermissions: async (roleId: string): Promise<Permission[]> => {
    const response = await api.get<Permission[]>(`/admin/roles/${roleId}/permissions`);
    return response.data;
  }
};
