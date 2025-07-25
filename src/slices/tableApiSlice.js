import { apiSlice } from "./apiSlice";
const TABLES_URL = "/api/tables";

export const tableApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlayerTable: builder.query({
      query: (dbName) => ({
        url: `${TABLES_URL}/players?dbName=${dbName}`,
      }),
      providesTags: ["PlayerTable"],
    }),
    updatePlayerTable: builder.mutation({
      query: (dbName) => ({
        url: `${TABLES_URL}/update-players`,
        method: "PATCH",
        body: { dbName }
      }),
      invalidatesTags: ["PlayerTable"],
    }), 
    getClassicTable: builder.query({
      query: (dbName) => ({
        url: `${TABLES_URL}/classic?dbName=${dbName}`,
      }),
      providesTags: ["TeamClassic"],
    }),
    updateClassicTable: builder.mutation({
      query: (dbName) => ({
        url: `${TABLES_URL}/update-classic`,
        method: "PATCH",
        body: { dbName }
      }),
      invalidatesTags: ["TeamClassic"],
    }), 
    getH2HTable: builder.query({
      query: (dbName) => ({
      url: `${TABLES_URL}/h2h?dbName=${dbName}`,
      }),
      providesTags: ["TeamH2H"],
    }),
    updateH2HTable: builder.mutation({
      query: (dbName) => ({
        url: `${TABLES_URL}/update-h2h`,
        method: "PATCH",
        body: { dbName }
      }),
      invalidatesTags: ["TeamH2H"],
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
