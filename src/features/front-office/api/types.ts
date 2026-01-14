export interface AdmissionEnquiry {
  id: string | number;
  ref: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  nextFollowUp: string;
  assignedTo: string;
}
