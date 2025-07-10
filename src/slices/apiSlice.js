import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const isProd = import.meta.env.MODE === 'production';

const baseUrl = isProd
  ? import.meta.env.VITE_PROD_API_URL
  : import.meta.env.VITE_DEV_API_URL;

const baseQuery = fetchBaseQuery({baseUrl,                                credentials: 'include'})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User', 'Team', 'Player', 'Fixture', 'League',
        'H2HLeague', 'ClassicLeague'
    ],
    endpoints: (builder) => ({})
})