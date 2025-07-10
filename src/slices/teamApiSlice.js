import { apiSlice } from "./apiSlice";

const TEAMS_URL = "/api/teams";
export const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    get: builder.query({
      query: (dbName) => ({
        url: `${TEAMS_URL}?dbName=${dbName}`,
      }),
      providesTags: ["Team"],
    }),
    getTeam: builder.query({
      query: (teamId, dbName) => ({
        url: `${TEAMS_URL}/${teamId}? dbName=${dbName}`,
      }),
    }),
    add: builder.mutation({
      query: (dbName) => ({
        url: `${TEAMS_URL}`,
        method: "POST",
body: {dbName}
      }),
      invalidatesTags: ["Team"],
    }),
    edit: builder.mutation({
      query: ({ dbName, id, ...rest }) => ({
        url: `${TEAMS_URL}/${id}`,
        method: "PATCH",
        body: { rest, dbName },
      }),
      invalidatesTags: ["Team"],
    }),
    deleteAll: builder.mutation({
      query: (dbName) => ({
        url: `${TEAMS_URL}`,
        method: "DELETE",
        body: {dbName}
      }),
      invalidatesTags: ["Team"],
    }),
    delete: builder.mutation({
      query: (teamId, dbName) => ({
        url: `${TEAMS_URL}/${teamId}`,
        method: "DELETE",
        body: {dbName}
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetQuery,
  useGetTeamQuery,
  useAddMutation,
  useEditMutation,
  useDeleteAllMutation,
  useDeleteMutation,
} = teamApiSlice;
