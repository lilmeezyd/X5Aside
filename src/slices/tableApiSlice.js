import { apiSlice } from "./apiSlice";
const TABLES_URL = "/api/tables";

export const tableApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlayerTable: builder.query({
      query: (dbName) => ({
        url: `${TABLES_URL}/players?dbName=${dbName}`,
      }),
      providesTags: ["Table"],
    }),
    updatePlayerTable: builder.mutation({
      query: (dbName) => ({
        url: `${TABLES_URL}/update-players`,
        method: "PATCH",
        body: { dbName }
      }),
      invalidatesTags: ["Table"],
    }), 
    getClassicTable: builder.query({
      query: (dbName) => ({
        url: `${TABLES_URL}/classic?dbName=${dbName}`,
      }),
      providesTags: ["Table"],
    }),
    updateClassicTable: builder.mutation({
      query: (dbName) => ({
        url: `${TABLES_URL}/update-classic`,
        method: "PATCH",
        body: { dbName }
      }),
      invalidatesTags: ["Table"],
    }), 
    getH2HTable: builder.query({
      query: (dbName) => ({
      url: `${TABLES_URL}/h2h?dbName=${dbName}`,
      }),
      providesTags: ["Table"],
    }),
    updateH2HTable: builder.mutation({
      query: (dbName) => ({
        url: `${TABLES_URL}/update-h2h`,
        method: "PATCH",
        body: { dbName }
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
