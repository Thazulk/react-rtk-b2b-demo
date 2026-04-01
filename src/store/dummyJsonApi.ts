import type { AuthState } from "@/store/authSlice";
import type {
  AddCartRequest,
  Cart,
  CartListResponse,
  CartProduct,
  LoginRequest,
  LoginResponse,
  Product,
  ProductListResponse,
  UpdateCartRequest,
  User,
} from "@/types/dummyjson";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    getProducts: builder.query<
      ProductListResponse,
      { limit?: number; skip?: number } | void
    >({
      query: (params) => ({
        url: "/products",
        params: params ?? {},
      }),
      providesTags: ["Products"],
    }),
    getCartsByUser: builder.query<CartListResponse, number>({
      query: (userId) => `/carts/user/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "CartsByUser", id: userId },
      ],
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
      invalidatesTags: (_result, _error, arg) => [
        { type: "CartsByUser", id: arg.userId },
      ],
    }),
    updateCart: builder.mutation<
      Cart,
      { cartId: number; body: UpdateCartRequest }
    >({
      query: ({ cartId, body }) => ({
        url: `/carts/${cartId}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(
        { cartId, body },
        { dispatch, getState, queryFulfilled },
      ) {
        const state = getState() as any;

        const currentCart =
          dummyJsonApi.endpoints.getCartById.select(cartId)(state).data;
        if (!currentCart) {
          await queryFulfilled.catch(() => undefined);
          return;
        }

        const productMetaById = new Map<number, Product>();
        const queries = Object.values(
          (state[dummyJsonApi.reducerPath]?.queries ?? {}) as Record<
            string,
            {
              endpointName?: string;
              data?: unknown;
            }
          >,
        );
        for (const queryState of queries) {
          if (queryState.endpointName !== "getProducts") {
            continue;
          }
          const data = queryState.data as ProductListResponse | undefined;
          for (const product of data?.products ?? []) {
            productMetaById.set(product.id, product);
          }
        }

        const quantities = new Map<number, number>();
        if (body.merge) {
          for (const product of currentCart.products) {
            quantities.set(product.id, product.quantity);
          }
        }
        for (const product of body.products) {
          quantities.set(product.id, product.quantity);
        }

        const optimisticProducts: CartProduct[] = [];
        for (const [productId, quantity] of quantities) {
          if (quantity <= 0) {
            continue;
          }
          const existing = currentCart.products.find(
            (item) => item.id === productId,
          );
          const meta = productMetaById.get(productId);
          const price = existing?.price ?? meta?.price ?? 0;
          const discountPercentage =
            existing?.discountPercentage ?? meta?.discountPercentage ?? 0;
          const total = Number((price * quantity).toFixed(2));
          const discountedTotal = Number(
            (total * (1 - discountPercentage / 100)).toFixed(2),
          );

          optimisticProducts.push({
            id: productId,
            title: existing?.title ?? meta?.title ?? `Product #${productId}`,
            price,
            quantity,
            total,
            discountPercentage,
            discountedTotal,
            thumbnail: existing?.thumbnail ?? meta?.thumbnail ?? "",
          });
        }

        const total = Number(
          optimisticProducts
            .reduce((sum, item) => sum + item.total, 0)
            .toFixed(2),
        );
        const discountedTotal = Number(
          optimisticProducts
            .reduce((sum, item) => sum + item.discountedTotal, 0)
            .toFixed(2),
        );
        const totalQuantity = optimisticProducts.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        const patchResult = dispatch(
          dummyJsonApi.util.updateQueryData("getCartById", cartId, (draft) => {
            draft.products = optimisticProducts;
            draft.total = total;
            draft.discountedTotal = discountedTotal;
            draft.totalProducts = optimisticProducts.length;
            draft.totalQuantity = totalQuantity;
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            dummyJsonApi.util.upsertQueryData("getCartById", cartId, data),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "Cart", id: arg.cartId },
      ],
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
