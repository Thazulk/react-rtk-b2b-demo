import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthState } from "@/store/authSlice";
import type {
  AddCartRequest,
  Cart,
  CartListResponse,
  LoginRequest,
  LoginResponse,
  ProductListResponse,
  UpdateCartRequest,
  User,
} from "@/types/dummyjson";

type HeaderState = {
  auth: Pick<AuthState, "accessToken">;
};

export const dummyJsonApi = createApi({
  reducerPath: "dummyJsonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as HeaderState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products", "Cart", "CartsByUser"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    getAuthMe: builder.query<User, void>({
      query: () => "/auth/me",
    }),
    getProducts: builder.query<ProductListResponse, { limit?: number; skip?: number } | void>({
      query: (params) => ({
        url: "/products",
        params: params ?? {},
      }),
      providesTags: ["Products"],
    }),
    getCartsByUser: builder.query<CartListResponse, number>({
      query: (userId) => `/carts/user/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: "CartsByUser", id: userId }],
    }),
    getCartById: builder.query<Cart, number>({
      query: (cartId) => `/carts/${cartId}`,
      providesTags: (_result, _error, cartId) => [{ type: "Cart", id: cartId }],
    }),
    addCart: builder.mutation<Cart, AddCartRequest>({
      query: (body) => ({
        url: "/carts/add",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "CartsByUser", id: arg.userId }],
    }),
    updateCart: builder.mutation<Cart, { cartId: number; body: UpdateCartRequest }>({
      query: ({ cartId, body }) => ({
        url: `/carts/${cartId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Cart", id: arg.cartId }],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetAuthMeQuery,
  useGetProductsQuery,
  useGetCartsByUserQuery,
  useGetCartByIdQuery,
  useAddCartMutation,
  useUpdateCartMutation,
} = dummyJsonApi;
