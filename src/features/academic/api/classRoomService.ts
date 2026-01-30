import api from '../../../services/apiClient';

// Use the Academic Service URL, falling back to the main API URL
const ACADEMIC_BASE_URL = import.meta.env.VITE_ACADEMIC_SERVICE_URL || import.meta.env.VITE_API_URL;

export interface ClassRoom {
  id: string;
  roomNumber: string;
  name: string;
  capacity: number;
  infraType: string;
  buildingBlock: string;
  status?: 'Active' | 'Maintenance' | 'Inactive'; // Make status optional to handle missing API data
}

export interface CreateClassRoomDto {
  roomNumber: string;
  name: string;
  capacity: number;
  infraType: string;
  buildingBlock: string;
  status: 'Active' | 'Maintenance' | 'Inactive'; // Use 'Active' instead of 'OK'
}

export const classRoomService = {
  getAll: async (): Promise<ClassRoom[]> => {
    const response = await api.get<ClassRoom[]>('/classrooms', {
      baseURL: ACADEMIC_BASE_URL
    });
    return response.data;
  },

  create: async (data: CreateClassRoomDto): Promise<ClassRoom> => {
    const response = await api.post<ClassRoom>('/classrooms', data, {
      baseURL: ACADEMIC_BASE_URL
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateClassRoomDto>): Promise<ClassRoom> => {
    const response = await api.patch<ClassRoom>(`/classrooms/${id}`, data, {
      baseURL: ACADEMIC_BASE_URL
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/classrooms/${id}`, {
      baseURL: ACADEMIC_BASE_URL
    });
  }
};
