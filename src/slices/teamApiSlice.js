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
        url: `${TEAMS_URL}/${teamId}?dbName=${dbName}`,
      }),
    }),
    getTeamTotalPoints: builder.query({
      query: (dbName) => ({
        url: `${TEAMS_URL}/total?dbName=${dbName}`,
      }),
    }),
    add: builder.mutation({
      query: (dbName) => ({
        url: `${TEAMS_URL}`,
        method: "POST",
        body: { dbName },
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
        body: { dbName },
      }),
      invalidatesTags: ["Team", "Player", "Leaderboard", "PlayerTable"],
    }),
    delete: builder.mutation({
      query: (teamId, dbName) => ({
        url: `${TEAMS_URL}/${teamId}`,
        method: "DELETE",
        body: { dbName },
      }),
      invalidatesTags: ["Team", "Player", "Leaderboard", "PlayerTable"],
    }),
    createProTeamAndMembers: builder.mutation({
      query: ({ dbName, image, managerIds, teamName, shortName }) => {
        const formData = new FormData();

        formData.append("dbName", dbName);
        formData.append("teamName", teamName);
        formData.append("shortName", shortName);

        // Arrays must also be appended
        formData.append("managerIds", JSON.stringify(managerIds));

        // The actual file
        formData.append("file", image);

        return {
          url: `${TEAMS_URL}/createProTeamAndMembers?dbName=${dbName}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Team", "User" ]
    }),
    getPicks: builder.query({
      query: (dbName) => ({
        url: `${TEAMS_URL}/picks?dbName=${dbName}`,
      }),
      providesTags: ["Team"],
    }),
    getPicksWithPoints: builder.query({
      query: (dbName, eventId) => ({
        url: `${TEAMS_URL}/event/${eventId}/picksWithPoints?dbName=${dbName}`,
      }),
      providesTags: ["Team"],
    }),
    editPicks: builder.mutation({
      query: ({dbName, eventId, picks}) => ({
        url: `${TEAMS_URL}/event/${eventId}/picks?dbName=${dbName}`,
        method: "PUT",
        body: { picks },
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetQuery,
  useGetTeamQuery,
  useGetTeamTotalPointsQuery,
  useAddMutation,
  useEditMutation,
  useDeleteAllMutation,
  useDeleteMutation,
  useCreateProTeamAndMembersMutation,
  useGetPicksQuery,
  useGetPicksWithPointsQuery,
  useEditPicksMutation
} = teamApiSlice;
