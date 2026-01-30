import api from '../../../services/apiClient';

// Use the Academic Service URL, falling back to the main API URL
const ACADEMIC_BASE_URL = import.meta.env.VITE_ACADEMIC_SERVICE_URL || import.meta.env.VITE_API_URL;

export interface AdmissionEnquiry {
  id: string;
  enquirerName: string;
  phoneNumber: string;
  enquiryType: 'PARENT' | 'STUDENT' | 'TEACHER' | 'OTHER';
  source: 'WEBSITE' | 'WALK_IN' | 'CALL' | 'REFERRAL' | 'OTHER';
  enquiryDate: string;
  description?: string;
  lastFollowUpDate?: string;
  nextFollowUpDate?: string;
  status: 'NEW' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';
  remarks?: string;
  assignedTo?: string; // Not in the GET response example but in UI requirements
  createdAt?: string;
}

export interface CreateAdmissionEnquiryDto {
  enquirerName: string;
  phoneNumber: string;
  enquiryType: string;
  source: string;
  enquiryDate: string;
  description?: string;
  nextFollowUpDate?: string;
  remarks?: string;
}

export interface UpdateFollowUpDto {
  followUpDate: string;
  note: string;
  nextFollowUpDate?: string;
}

export interface UpdateStatusDto {
  status: 'NEW' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';
}

export interface EnquiryResponse {
  content: AdmissionEnquiry[];
  page: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const admissionService = {
  getAll: async (params?: any): Promise<EnquiryResponse> => {
    // Hardcoded academic year context as per requirement pattern
    const academicYearId = '00000000-0000-0000-0000-000000000002'; 

    const response = await api.get<EnquiryResponse>('/front-office/admission-enquiries', {
      baseURL: ACADEMIC_BASE_URL,
      params,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  create: async (data: CreateAdmissionEnquiryDto): Promise<AdmissionEnquiry> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';

    const response = await api.post<AdmissionEnquiry>('/front-office/admission-enquiries', data, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  getById: async (id: string): Promise<AdmissionEnquiry> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.get<AdmissionEnquiry>(`/front-office/admission-enquiries/${id}`, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<AdmissionEnquiry> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    // The endpoint is .../{id}/status, likely expecting a JSON body with the status or just the status string depending on backend.
    // Based on typical patterns, it's likely a PATCH with a body.
    const response = await api.patch<AdmissionEnquiry>(
      `/front-office/admission-enquiries/${id}/status`, 
      { status }, 
      {
        baseURL: ACADEMIC_BASE_URL,
        headers: {
          'X-Academic-Year-Id': academicYearId
        }
      }
    );
    return response.data;
  },

  updateFollowUp: async (id: string, data: UpdateFollowUpDto): Promise<AdmissionEnquiry> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.patch<AdmissionEnquiry>(
      `/front-office/admission-enquiries/${id}/follow-up`, 
      data, 
      {
        baseURL: ACADEMIC_BASE_URL,
        headers: {
          'X-Academic-Year-Id': academicYearId
        }
      }
    );
    return response.data;
  }
};
