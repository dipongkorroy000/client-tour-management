import { baseApi } from "@/redux/baseApi";
import type { IResponse, ITourPackage } from "@/types";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTourType: builder.mutation({
      query: (tourTypeName) => ({ url: "/tour/create-tour-type", method: "POST", data: tourTypeName }),
      invalidatesTags: ["TOUR"],
    }),
    getTourTypes: builder.query({
      query: () => ({ url: "/tour/tour-types", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: ["TOUR"],
    }),
    removeTourType: builder.mutation({
      query: (tourTypeId) => ({ url: `/tour/tour-types/${tourTypeId}`, method: "DELETE" }),
      invalidatesTags: ["TOUR"],
    }),
    addTour: builder.mutation({
      query: (tourData) => ({ url: "/tour/create", method: "POST", data: tourData }),
      invalidatesTags: ["TOUR"],
    }),
    getTours: builder.query<ITourPackage[], unknown>({
      query: (params) => ({ url: "/tour", method: "GET", params: params }),
      providesTags: ["TOUR"],
      transformResponse: (response: IResponse<ITourPackage[]>) => response.data,
    }),
  }),
});

export const { useAddTourTypeMutation, useGetTourTypesQuery, useRemoveTourTypeMutation, useAddTourMutation, useGetToursQuery } = tourApi;
