import { baseApi } from "@/redux/baseApi";
import type { ILogin, IResponse, ISendOTP, IVerifyOTP } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({ url: "/user/register", method: "POST", data: userInfo }),
    }),
    login: builder.mutation<null, ILogin>({
      query: (userInfo) => ({ url: "/auth/login", method: "POST", data: userInfo }),
    }),
    sendOTP: builder.mutation<IResponse<null>, ISendOTP>({
      query: (userInfo) => ({ url: "otp/send", method: "POST", data: userInfo }),
    }),
    verifyOTP: builder.mutation<IResponse<null>, IVerifyOTP>({
      query: (userInfo) => ({ url: "otp/verify", method: "POST", data: userInfo }),
    }),
    userInfo: builder.query({
      query: () => ({ url: "/user/me", method: "GET" }),
      providesTags: ["USER"],
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useSendOTPMutation, useVerifyOTPMutation, useUserInfoQuery, useLogoutMutation } =
  authApi;
