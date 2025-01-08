import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const Base_URL=import.meta.env.VITE_API_URL;
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
    }),
    getUsers: builder.query({
      query: ({ skip = 0, limit = 100 }) => `/users?skip=${skip}&limit=${limit}`,
    }),
    getCurrentUser: builder.query({
      query: () => '/users/me',
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: userData,
      }),
    }),
    updateMe: builder.mutation({
      query: (userData) => ({
        url: '/users/me',
        method: 'PATCH',
        body: userData,
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
    }),
    getContacts: builder.query({
      query: () => '/contacts',
      responseHandler: async (response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        // Extract the raw CSV text from the response
        const responseText = await response.text();
    
        // Parse total records (excluding empty lines and the header row)
        const rows = responseText.split('\n').filter((line) => line.trim() !== '');
        const totalRecords = rows.length > 1 ? rows.length - 1 : 0;
    
        console.log('Total Records:', totalRecords);
    
        return {
          data: responseText,
          totalRecords,
        };
      },
      transformResponse: (responseText) => responseText, // Ensure no JSON parsing occurs
      cache: 'no-cache', // Prevent JSON parsing issues
    }),
    
    uploadCsv: builder.mutation({
      query: (formData) => ({
        url: '/upload-csv/',
        method: 'POST',
        body: formData,
      }),
    }),
    filterContacts: builder.mutation({
      query: (filterCriteria) => ({
        url: '/filter-contacts/',
        method: 'POST',
        body: filterCriteria,
        responseHandler: async (response) => {
          // Check if the response is successful
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          // Get the response text (CSV content)
          const responseText = await response.text();
    
          // Calculate total records by counting the number of non-empty lines, excluding the header row
          const totalRecords = responseText
            .split('\n') // Split CSV content into lines
            .filter((line, index) => line.trim() !== '' && index > 0) // Exclude the header row (index > 0) and empty lines
            .length;
    
          console.log('Total Records:', totalRecords);
    
          // Return an object with both the CSV content and total records
          return {
            data: responseText,
            totalRecords, // Include total records in the returned object
          };
        },
        cache: 'no-cache', // Disable automatic JSON parsing
      }),
    }),    
    triggerGeocodeUpdate: builder.mutation({
      query: (fileName) => ({
        url: `/trigger-geocode-update/?file_name=${fileName}`,
        method: 'POST',
      }),
    }),
    getGeocodeTaskStatus: builder.query({
      query: (taskId) => `/geocode-task-status/${taskId}`,
    }),
    getCurrentTasks: builder.query({
      query: () => '/current-tasks/',
    }),
    getMetrics: builder.query({
      query: () => '/metrics',
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useUpdateMeMutation,
  useDeleteUserMutation,
  useGetContactsQuery,
  useUploadCsvMutation,
  useFilterContactsMutation,
  useTriggerGeocodeUpdateMutation,
  useGetCurrentTasksQuery,
  useGetGeocodeTaskStatusQuery,
  useGetMetricsQuery,
} = apiSlice;