import api from '../../../services/apiClient';

const ACADEMIC_BASE_URL = import.meta.env.VITE_ACADEMIC_SERVICE_URL || import.meta.env.VITE_API_URL;

export interface PostalRecord {
  id: string;
  direction: 'RECEIVED' | 'DISPATCHED';
  postalType: 'LETTER' | 'PARCEL' | 'COURIER';
  referenceNumber: string;
  fromTitle: string;
  toTitle: string;
  courierName: string;
  date: string;
  attachmentUrl?: string;
  notes?: string;
  remarks?: string;
  status?: string;
}

export interface CreatePostalRecordDto {
  direction: 'RECEIVED' | 'DISPATCHED';
  postalType: 'LETTER' | 'PARCEL' | 'COURIER';
  referenceNumber: string;
  fromTitle: string;
  toTitle: string;
  courierName: string;
  date: string;
  attachmentUrl?: string;
  notes?: string;
  remarks?: string;
}

export interface PostalResponse {
  content: PostalRecord[];
  page: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const postalService = {
  getAll: async (params?: any): Promise<PostalResponse> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.get<PostalResponse>('/front-office/postal-records', {
      baseURL: ACADEMIC_BASE_URL,
      params,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  create: async (data: CreatePostalRecordDto): Promise<PostalRecord> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.post<PostalRecord>('/front-office/postal-records', data, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  getById: async (id: string): Promise<PostalRecord> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.get<PostalRecord>(`/front-office/postal-records/${id}`, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  }
};
