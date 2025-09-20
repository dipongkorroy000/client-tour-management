import { baseApi } from "@/redux/baseApi";

export const divisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDivision: builder.mutation({
      query: (divisionData) => ({ url: "/division/create", method: "POST", data: divisionData }),
      invalidatesTags: ["DIVISION"],
    }),
    getDivisions: builder.query({
      query: () => ({ url: "/division", method: "GET" }),
      providesTags: ["DIVISION"],
      transformResponse: (response) => response.data,
    }),
    getDivision: builder.query({
      query: ({ _id }) => ({ url: `/division/${_id}`, method: "GET" }),
      providesTags: ["DIVISION"],
      transformResponse: (response) => response.data.name,
    }),
  }),
});

export const { useAddDivisionMutation, useGetDivisionsQuery, useGetDivisionQuery } = divisionApi;
