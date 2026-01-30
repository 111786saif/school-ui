import api from '../../../services/apiClient';

// Use the Academic Service URL, falling back to the main API URL
const ACADEMIC_BASE_URL = import.meta.env.VITE_ACADEMIC_SERVICE_URL || import.meta.env.VITE_API_URL;

export interface Complaint {
  id: string;
  complainantName: string;
  complaintType: 'PARENT' | 'STUDENT' | 'STAFF' | 'OTHER';
  category?: string;
  complaintDate: string;
  description?: string;
  actionTaken?: string;
  assignedToStaffId?: string;
  assignedToStaffName?: string;
  internalNote?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComplaintDto {
  complainantName: string;
  complaintType: string;
  category?: string;
  complaintDate: string;
  description?: string;
  internalNote?: string;
  remarks?: string;
}

export interface UpdateStatusDto {
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  actionTaken?: string;
}

export interface AssignStaffDto {
  staffId: string; 
}

export interface ComplaintResponse {
  content: Complaint[];
  page: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const complaintService = {
  getAll: async (params?: any): Promise<ComplaintResponse> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002'; 

    const response = await api.get<ComplaintResponse>('/front-office/complaints', {
      baseURL: ACADEMIC_BASE_URL,
      params,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  create: async (data: CreateComplaintDto): Promise<Complaint> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';

    const response = await api.post<Complaint>('/front-office/complaints', data, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Complaint> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.get<Complaint>(`/front-office/complaints/${id}`, {
      baseURL: ACADEMIC_BASE_URL,
      headers: {
        'X-Academic-Year-Id': academicYearId
      }
    });
    return response.data;
  },

  updateStatus: async (id: string, status: string, actionTaken?: string): Promise<Complaint> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const payload: UpdateStatusDto = { status: status as any };
    if (actionTaken) payload.actionTaken = actionTaken;

    const response = await api.patch<Complaint>(
      `/front-office/complaints/${id}/status`, 
      payload, 
      {
        baseURL: ACADEMIC_BASE_URL,
        headers: {
          'X-Academic-Year-Id': academicYearId
        }
      }
    );
    return response.data;
  },

  assignStaff: async (id: string, staffId: string): Promise<Complaint> => {
    const academicYearId = '00000000-0000-0000-0000-000000000002';
    const response = await api.patch<Complaint>(
      `/front-office/complaints/${id}/assign`, 
      { staffId }, 
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