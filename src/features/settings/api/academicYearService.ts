import api from '../../../services/apiClient';

// Professional handling of microservice endpoints
// Fallback to main API URL if specific service URL is not defined
const ACADEMIC_BASE_URL = import.meta.env.VITE_ACADEMIC_SERVICE_URL || import.meta.env.VITE_API_URL;

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface CreateAcademicYearDto {
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export const academicYearService = {
  getAll: async (): Promise<AcademicYear[]> => {
    // Override baseURL for this specific microservice request
    const response = await api.get<AcademicYear[]>('/academic-years', {
      baseURL: ACADEMIC_BASE_URL
    });
    return response.data;
  },

  create: async (data: CreateAcademicYearDto): Promise<AcademicYear> => {
    const response = await api.post<AcademicYear>('/academic-years', data, {
      baseURL: ACADEMIC_BASE_URL
    });
    return response.data;
  },

  update: async (id: string, data: Partial<AcademicYear>): Promise<AcademicYear> => {
    const response = await api.patch<AcademicYear>(`/academic-years/${id}`, data, {
      baseURL: ACADEMIC_BASE_URL
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/academic-years/${id}`, {
      baseURL: ACADEMIC_BASE_URL
    });
  },

  makeCurrent: async (id: string): Promise<AcademicYear> => {
    const response = await api.patch<AcademicYear>(`/academic-years/${id}`, { isCurrent: true }, {
      baseURL: ACADEMIC_BASE_URL
    });
    return response.data;
  }
};
