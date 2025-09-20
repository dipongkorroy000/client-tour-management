import { baseApi } from "@/redux/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => ({ url: "/booking", method: "POST", data: bookingData }),
      invalidatesTags: ["BOOKING"],
    }),
    getTours: builder.query({
      query: (params) => ({ url: "/tour", method: "GET", params: params }),
      providesTags: ["BOOKING"],
    }),
  }),
});

export const { useCreateBookingMutation } = bookingApi;
