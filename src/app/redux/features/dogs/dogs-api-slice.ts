import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const DOG_API_KEY = 'live_0Rz7PG4ydOx2xbNeYmzfPHx5aNVMLk6SsZVGtTDzyimHmt6xKv9YbJ9HH4YFHGFd'

interface Breed {
  id: string
  name: string
  image: {
    url: string
  }
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.thedogapi.com/v1', prepareHeaders: (headers) => headers.set('x-api-key', DOG_API_KEY) }),
  endpoints: (builder) => ({
    getBreeds: builder.query<Breed[], number | void>({
      query: (limit = 10) => `/breeds?limit=${limit}`,
    }),
  }),
})

export const { useGetBreedsQuery } = apiSlice;