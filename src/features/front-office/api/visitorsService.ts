import api from '../../../services/apiClient';

// Use the Academic Service URL, falling back to the main API URL
const ACADEMIC_BASE_URL = import.meta.env.VITE_ACADEMIC_SERVICE_URL || import.meta.env.VITE_API_URL;

export interface Visitor {
  id: string;
  visitorName: string;
  phoneNumber: string;
  purpose: string;
  numberOfPersons: number;
  idProofType?: string;
  idProofNumber?: string;
  checkInTime: string;
  checkOutTime?: string;
  remarks?: string;
  status: string;
  createdAt?: string;
}

export interface CreateVisitorDto {
  visitorName: string;
  phoneNumber: string;
  purpose: string;
  numberOfPersons: number;
  idProofType?: string;
  idProofNumber?: string;
  checkInTime: string;
  remarks?: string;
}

export interface CheckoutVisitorDto {
  checkOutTime: string;
  remarks?: string;
}

export interface VisitorResponse {
  content: Visitor[];
  page: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const visitorsService = {
  getAll: async (params?: any): Promise<VisitorResponse> => {
    // We need to pass the X-Academic-Year-Id header. 
    // In a real app, this might come from a global context/store.
    // For now, I'll hardcode it based on the screenshot, but ideally, it should be dynamic.
    const academicYearId = '00000000-0000-0000-0000-000000000002'; 

    const response = await api.get<VisitorResponse>('/front-office/visitors', {
      baseURL: ACADEMIC_BASE_URL,
      params,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  create: async (data: CreateVisitorDto): Promise<Visitor> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';

    const response = await api.post<Visitor>('/front-office/visitors', data, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  checkout: async (id: string, data: CheckoutVisitorDto): Promise<Visitor> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    // Using the specific checkout action endpoint
    const response = await api.patch<Visitor>(`/front-office/visitors/${id}/checkout`, data, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Visitor> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.get<Visitor>(`/front-office/visitors/${id}`, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  }
};