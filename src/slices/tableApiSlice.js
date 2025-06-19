import { apiSlice } from "./apiSlice";
const TABLES_URL = "/api/players";

export const playerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: () => ({
        url: `${PLAYERS_URL}`,
      }),
      providesTags: ['Player']
    }),
    getPlayer: builder.query({
      query: (id) => ({
        url: `${PLAYERS_URL}/${id}`
      })
    }),
    addPlayer: builder.mutation({
      query: (data) => ({
        url: `${PLAYERS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Player']
    }),
   editPlayer: builder.mutation({
      query: ({id, ...rest}) => ({
        url: `${PLAYERS_URL}/${id}`,
        method: "PATCH",
        body: rest, 
      }), 
      invalidatesTags: ['Player']
    }),
    deletePlayer: builder.mutation({
      query: (id) => ({
        url: `${PLAYERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Player']
    }),
    deleteAllPlayers: builder.mutation({
      query: () => ({
        url: `${PLAYERS_URL}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Player']
    }),
    fetchPoints: builder.mutation({
      query: () => ({
        url: `${PLAYERS_URL}/sync-event-points`,
        method: "PATCH",
      }),
      invalidatesTags: ['Player']
    }),
    updateLeaderboard: builder.mutation({
      query: () => ({
        url: `${PLAYERS_URL}/update-leading-scorers`,
        method: "POST",
      }),
      invalidatesTags: ['Player']
    }),
    getLeaderboard: builder.query({
      query: () => ({
        url: `${PLAYERS_URL}/get-leading-scorers`
      }),
      provideTags: ['Player']
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
  useFetchPointsMutation,
  useUpdateLeaderboardMutation,
  useGetLeaderboardQuery
} = playerApiSlice; 