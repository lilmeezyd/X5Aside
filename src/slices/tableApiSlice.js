import { apiSlice } from "./apiSlice";
const TABLES_URL = "/api/tables";

export const tableApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlayerTable: builder.query({
      query: () => ({
        url: `${TABLES_URL}/players`,
      }),
      providesTags: ["Table"],
    }),
    updatePlayerTable: builder.mutation({
      query: () => ({
        url: `${TABLES_URL}/update-players`,
        method: "PATCH",
      }),
      invalidatesTags: ["Table"],
    }), 
    getClassicTable: builder.query({
      query: () => ({
        url: `${TABLES_URL}/classic`,
      }),
      providesTags: ["Table"],
    }),
    updateClassicTable: builder.mutation({
      query: () => ({
        url: `${TABLES_URL}/update-classic`,
        method: "PATCH",
      }),
      invalidatesTags: ["Table"],
    }), 
    getH2HTable: builder.query({
      query: () => ({
        url: `${TABLES_URL}/h2h`,
      }),
      providesTags: ["Table"],
    }),
    updateH2HTable: builder.mutation({
      query: () => ({
        url: `${TABLES_URL}/update-h2h`,
        method: "PATCH",
      }),
      invalidatesTags: ["Table"],
    }), 
  }),
});

export const {
  useGetPlayerTableQuery,
    useUpdatePlayerTableMutation,
  useGetClassicTableQuery,
    useUpdateClassicTableMutation,
  useGetH2HTableQuery,
    useUpdateH2HTableMutation
} = tableApiSlice;
