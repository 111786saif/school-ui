import api from '../../../services/apiClient';

// Use the Academic Service URL, falling back to the main API URL
const ACADEMIC_BASE_URL = import.meta.env.VITE_ACADEMIC_SERVICE_URL || import.meta.env.VITE_API_URL;

export interface PhoneCall {
  id: string;
  callerName: string;
  phoneNumber: string;
  callDate: string;
  callType: 'INCOMING' | 'OUTGOING';
  callDuration?: string;
  description?: string;
  nextFollowUpDate?: string;
  status: string;
  remarks?: string;
  createdAt?: string;
}

export interface CreatePhoneCallDto {
  callerName: string;
  phoneNumber: string;
  callDate: string;
  callType: 'INCOMING' | 'OUTGOING';
  callDuration?: string;
  description?: string;
  nextFollowUpDate?: string;
  remarks?: string;
}

export interface PhoneCallResponse {
  content: PhoneCall[];
  page: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const phoneCallsService = {
  getAll: async (params?: any): Promise<PhoneCallResponse> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002'; 

    const response = await api.get<PhoneCallResponse>('/front-office/phone-calls', {
      baseURL: ACADEMIC_BASE_URL,
      params,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  create: async (data: CreatePhoneCallDto): Promise<PhoneCall> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';

    const response = await api.post<PhoneCall>('/front-office/phone-calls', data, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  getById: async (id: string): Promise<PhoneCall> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.get<PhoneCall>(`/front-office/phone-calls/${id}`, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  }
};
