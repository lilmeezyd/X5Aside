import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['User']
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['User']
    }),
    registerTeamManager: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/registerTeamManager`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ['User']
    }),
    getRegisteredTeamManagers: builder.query({
      query: () => ({
        url: `${USERS_URL}/getRegisteredTeamManagers`
      }),
      providesTags: ['User']
    }),
    deleteTeamManager: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/teamManagers/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["User"]
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data, 
      }),
      invalidatesTags: ['User']
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRegisterTeamManagerMutation,
  useGetRegisteredTeamManagersQuery,
  useLogoutMutation,
  useUpdateUserMutation,
  useDeleteTeamManagerMutation
} = userApiSlice;