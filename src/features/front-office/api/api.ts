import { apiSlice } from '../../../store/apiSlice';
import { AdmissionEnquiry } from './types';

export const frontOfficeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdmissionEnquiries: builder.query<AdmissionEnquiry[], void>({
      query: () => '/front-office/enquiries',
    }),
  }),
});

export const { useGetAdmissionEnquiriesQuery } = frontOfficeApiSlice;
