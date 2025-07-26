import { apiSlice } from "./apiSlice";
const EVENTS_URL = "/api/events";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (dbName) => ({
    url: `${EVENTS_URL}?dbName=${dbName}`,
      }),
      providesTags: ["Event"],
    }),
    setCurrentEvent: builder.mutation({
      query: (dbName) => ({
        url: `${EVENTS_URL}/set-current-event`,
        method: "PATCH",
        body: {dbName},
      }),
      invalidatesTags: ["Event"],
    }),
    resetEvents: builder.mutation({
      query: (dbName) => ({
        url: `${EVENTS_URL}/reset`,
        method: "PATCH",
        body: { dbName }
      }),
      invalidatesTags: ["Event"],
    }),
    fetchEvents: builder.query({
      query: (dbName) => ({
        url: `${EVENTS_URL}/fetch-events?dbName=${dbName}`
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useSetCurrentEventMutation,
  useResetEventsMutation,
  useFetchEventsQuery
} = eventApiSlice;
