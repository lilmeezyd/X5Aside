import { apiSlice } from "./apiSlice";
const PLAYERS_URL = "/api/players";

export const playerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: (dbName) => ({
    url: `${PLAYERS_URL}?dbName=${dbName}`,
      }),
      providesTags: ["Player"],
    }),
    getPlayer: builder.query({
      query: (id, dbName) => ({
        url: `${PLAYERS_URL}/${id}?dbName=${dbName}`,
      }),
    }),
    addPlayer: builder.mutation({
      query: ({dbName, ...rest}) => ({
        url: `${PLAYERS_URL}`,
        method: "POST",
        body: {dbName, ...rest},
      }),
      invalidatesTags: ["Player", "Leaderboard", "PlayerTable"],
    }),
    editPlayer: builder.mutation({
      query: ({ dbName, id, ...rest }) => ({
        url: `${PLAYERS_URL}/${id}`,
        method: "PATCH",
        body: { dbName, ...rest}
      }),
      invalidatesTags: ["Player", "Team", "Leaderboard", "PlayerTable"],
    }),
    deletePlayer: builder.mutation({
      query: ({dbName, id}) => ({
        url: `${PLAYERS_URL}/${id}`,
        method: "DELETE",
        body: { dbName }
      }),
      invalidatesTags: ["Player", "Team", "Leaderboard", "PlayerTable"],
    }),
    deleteAllPlayers: builder.mutation({
      query: (dbName) => ({
        url: `${PLAYERS_URL}`,
        method: "DELETE",
        body: { dbName }
      }),
      invalidatesTags: ["Player", "Team", "Leaderboard", "PlayerTable", "PlayerFixture"],
    }),
    fetchPointsFromApi: builder.mutation({
      query: (dbName) => ({
        url: `${PLAYERS_URL}/sync-event-points`,
        method: "PUT",
        body: { dbName }
      }),
      invalidatesTags: ["Player"],
    }),
    updateTopScorers: builder.mutation({
      query: (dbName) => ({
        url: `${PLAYERS_URL}/update-leading-scorers`,
        method: "POST",
        body: { dbName }
      }),
      invalidatesTags: ["Player"],
    }),
    getTopScorers: builder.query({
      query: (dbName) => ({
        url: `${PLAYERS_URL}/get-leading-scorers?dbName=${dbName}`,
      }),
      providesTags: ["Player"],
    }),
  }),
});

export const {
  useGetPlayersQuery,
  useGetPlayerQuery,
  useAddPlayerMutation,
  useEditPlayerMutation,
  useDeletePlayerMutation,
  useDeleteAllPlayersMutation,
  useUpdateTopScorersMutation,
  useGetTopScorersQuery,
  useFetchPointsFromApiMutation,
} = playerApiSlice;
