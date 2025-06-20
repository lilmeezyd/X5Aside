import { apiSlice } from "./apiSlice";
const FIXTURES_URL = "/api/fixtures";

export const fixtureApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFixtures: builder.query({
      query: () => ({
        url: `${FIXTURES_URL}`,
      }),
      providesTags: ["Fixture"],
    }),
    getFixture: builder.query({
      query: (id) => ({
        url: `${FIXTURES_URL}/${id}`,
      }),
    }),
    getPlayerFixtures: builder.query({
      query: () => ({
        url: `${FIXTURES_URL}/player-fixtures`,
      }),
    }),
    addFixtures: builder.mutation({
      query: () => ({
        url: `${FIXTURES_URL}`,
        method: "POST",
      }),
      invalidatesTags: ["Fixture"],
    }),
    editFixture: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `${FIXTURES_URL}/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ["Fixture"],
    }),
    deleteFixture: builder.mutation({
      query: (id) => ({
        url: `${FIXTURES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fixture"],
    }),
    deleteAllFixtures: builder.mutation({
      query: () => ({
        url: `${FIXTURES_URL}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fixture"],
    }),
    createPlayerFixtures: builder.mutation({
      query: () => ({
        url: `${FIXTURES_URL}/create-player-fixtures`,
        method: "POST",
      }),
      invalidatesTags: ["Fixture"],
    }),
    calculateClassicScores: builder.mutation({
      query: () => ({
        url: `${FIXTURES_URL}/calculate-classic-scores`,
        method: "PATCH",
      }),
      invalidatesTags: ["Fixture"],
    }),
    calculateH2HScores: builder.mutation({
      query: () => ({
        url: `${FIXTURES_URL}/calculate-h2h-scores`,
        method: "PATCH",
      }),
      invalidatesTags: ["Fixture"],
    }),
    calculatePlayerFixScores: builder.mutation({
      query: () => ({
        url: `${FIXTURES_URL}/calculate-player-fixture-scores`,
        method: "PATCH",
      }),
      invalidatesTags: ["Fixture"],
    }),
  }),
});

export const {
  useGetFixturesQuery,
  useGetFixtureQuery,
  useAddFixturesMutation,
  useEditFixtureMutation,
  useDeleteFixtureMutation,
  useDeleteAllFixturesMutation,
  useCreatePlayerFixturesMutation,
  useCalculateClassicScoresMutation,
  useCalculateH2HScoresMutation,
  useGetPlayerFixturesQuery,
  useCalculatePlayerFixScoresMutation,
} = fixtureApiSlice;
