import { apiSlice } from "./apiSlice";
const UPLOAD_URL = "/api/upload";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTOW: builder.query({
      query: (dbName) => ({
    url: `${UPLOAD_URL}?dbName=${dbName}`,
      }),
      providesTags: ["TOW"],
    }),
    createTOW: builder.mutation({
      query: (dbName) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: {dbName},
      }),
      invalidatesTags: ["TOW"],
    }),
    uploadImage: builder.mutation({
      query: ({ dbName, eventId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        /*formData.append("dbName", dbName);  
console.log(dbName)
console.log(file)
console.log(eventId)
        console.log(formData)*/
        return {
          url: `${UPLOAD_URL}/event/${eventId}?dbName=${dbName}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["TOW"],
    }),
    deleteImage: builder.mutation({
      query: ({dbName, fileId, eventId }) => ({
        url: `${UPLOAD_URL}/file/${fileId}/event/${eventId}`,
        method: "DELETE",
        body: { dbName }
      }),
      invalidatesTags: ["TOW"],
    }),
  }),
});

export const {
  useGetTOWQuery,
  useCreateTOWMutation,
  useUploadImageMutation,
  useDeleteImageMutation
} = uploadApiSlice;
