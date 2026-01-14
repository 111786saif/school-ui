import { apiSlice } from '../../../store/apiSlice';
import { Student, Staff } from './types';

export const peoplesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => '/students',
      providesTags: ['Student'],
    }),
    getStaff: builder.query<Staff[], void>({
      query: () => '/staff',
      providesTags: ['Staff'],
    }),
  }),
});

export const { useGetStudentsQuery, useGetStaffQuery } = peoplesApiSlice;
