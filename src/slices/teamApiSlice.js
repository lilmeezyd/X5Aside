import { apiSlice } from "./apiSlice";
import store from "../store"
const TEAMS_URL = "/api/teams";
const dbName = store.getState().database.dbName;
console.log(TEAMS_URL)
console.log(dbName);
export const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    get: builder.query({
      query: () => ({
        url: `${TEAMS_URL}?dbName=${dbName}`,
      }),
      providesTags: ["Team"],
    }),
    getTeam: builder.query({
      query: (teamId) => ({
        url: `${TEAMS_URL}/${teamId}? dbName=${dbName}`,
      }),
    }),
    add: builder.mutation({
      query: (data) => ({
        url: `${TEAMS_URL}`,
        method: "POST",
body: {dbName}
      }),
      invalidatesTags: ["Team"],
    }),
    edit: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `${TEAMS_URL}/${id}`,
        method: "PATCH",
        body: { rest, dbName },
      }),
      invalidatesTags: ["Team"],
    }),
    deleteAll: builder.mutation({
      query: (teamId) => ({
        url: `${TEAMS_URL}`,
        method: "DELETE",
        body: {dbName}
      }),
      invalidatesTags: ["Team"],
    }),
    delete: builder.mutation({
      query: (teamId) => ({
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
