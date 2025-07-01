import { apiSlice } from "./apiSlice";
const FIXTURES_URL = "/api/fixtures";

export const fixtureApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFixtures: builder.query({
      query: (dbName) => ({
        url: `${FIXTURES_URL}?dbName=${dbName}`,
      }),
      providesTags: ["Fixture"],
    }),
    getFixture: builder.query({
      query: (id, dbName) => ({
        url: `${FIXTURES_URL}/${id}?dbName=${dbName}`,
      }),
    }),
    getPlayerFixtures: builder.query({
      query: (dbName) => ({
        url: `${FIXTURES_URL}/player-fixtures?dbName=${dbName}`,
      }),
    }),
    addFixtures: builder.mutation({
      query: (dbName) => ({
        url: `${FIXTURES_URL}`,
        method: "POST",
        body: { dbName }
      }),
      invalidatesTags: ["Fixture"],
    }),
    editFixture: builder.mutation({
      query: ({ dbName, id, ...rest }) => ({
        url: `${FIXTURES_URL}/${id}`,
        method: "PATCH",
        body: { dbName, ...rest }
      }),
      invalidatesTags: ["Fixture"],
    }),
    deleteFixture: builder.mutation({
      query: (id, dbName) => ({
        url: `${FIXTURES_URL}/${id}`,
        method: "DELETE",
        body: { dbName }
      }),
      invalidatesTags: ["Fixture"],
    }),
    deleteAllFixtures: builder.mutation({
      query: (dbName) => ({
        url: `${FIXTURES_URL}`,
        method: "DELETE",
        body: { dbName }
      }),
      invalidatesTags: ["Fixture"],
    }),
    createPlayerFixtures: builder.mutation({
      query: (dbName) => ({
        url: `${FIXTURES_URL}/create-player-fixtures`,
        method: "POST",
        body: { dbName }
      }),
      invalidatesTags: ["Fixture"],
    }),
    calculateClassicScores: builder.mutation({
      query: (dbName) => ({
        url: `${FIXTURES_URL}/calculate-classic-scores`,
        method: "PATCH",
        body: { dbName }
      }),
      invalidatesTags: ["Fixture"],
    }),
    calculateH2HScores: builder.mutation({
      query: (dbName) => ({
        url: `${FIXTURES_URL}/calculate-h2h-scores`,
        method: "PATCH",
        body: { dbName }
      }),
      invalidatesTags: ["Fixture"],
    }),
    calculatePlayerFixScores: builder.mutation({
      query: (dbName) => ({
        url: `${FIXTURES_URL}/calculate-player-fixture-scores`,
        method: "PATCH",
        body: { dbName }
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
