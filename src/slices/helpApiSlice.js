import { apiSlice } from "./apiSlice";
const HELP_URL = "/api/help"

export const helpApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getHelp: builder.query({
            query: () =>({
               url: `${HELP_URL}`,
                         }),provideTags: ["Help"]
        }),
        createHeading: builder.mutation({
            query: (headingData) => ({
                url: `${HELP_URL}/heading`,
                method: 'POST',
                body: headingData
            }), invalidateTags: ['Help']
        }),
        createBody: builder.mutation({
            query: (bodyData) => ({
                url: `${HELP_URL}/body`,
                method: 'POST',
                body: bodyData
            }), invalidateTags: ['Help']
        }),
         deleteHeading: builder.mutation({
            query: (id) => ({
                url: `${HELP_URL}/heading/${id}`,
                method: 'DELETE',
            }), invalidateTags: ['Help']
        }),
        deleteBody: builder.mutation({
            query: (id) => ({
                url: `${HELP_URL}/body/${id}`,
                method: 'DELETE',
            }), invalidateTags: ['Help']
        }),
        editBody: builder.mutation({
             query: ({ id, ...patch }) => ({
                url: `${HELP_URL}/body/${id}`,
                method: 'PATCH',
                body: patch,
            }), invalidateTags: ['Help']
        }),
        editHeading: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `${HELP_URL}/heading/${id}`,
                method: 'PATCH',
                body: patch,
            }), invalidateTags: ['Help']
        }),
    })
});

export const { useGetHelpQuery, useCreateHeadingMutation, useCreateBodyMutation, useDeleteHeadingMutation, useDeleteBodyMutation, useEditBodyMutation, useEditHeadingMutation } = helpApiSlice;