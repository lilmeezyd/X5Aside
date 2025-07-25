import { apiSlice } from "./apiSlice";
const F1_URL = "/api/f1";
export const f1Api = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    triggerF1Calculation: builder.mutation({
      query: (dbName) => ({
        url: `${F1_URL}/calculate`,
        method: 'POST',
        body: { dbName }
      }),
      // trigger a refetch
      invalidatesTags: ['FormulaOne', 'FormulaOneTotal'],
    }),
    fetchF1Standings: builder.query({
      query: (dbName) => `${F1_URL}/standings?dbName=${dbName}`,
      providesTags: ['FormulaOneTotal']
    }),
    fetchF1ByEvent: builder.query({
      query: ({ dbName, eventId }) =>
        `${F1_URL}/event/${eventId}?dbName=${dbName}`,
      providesTags: ['FormulaOne']
    }),
  }),
});

export const {
  useTriggerF1CalculationMutation,
  useFetchF1StandingsQuery,
  useFetchF1ByEventQuery
} = f1Api;
