export interface PaginationMeta {
  limit: number;
  skip: number;
  total: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email: string;
  phone?: string;
  username: string;
  password?: string;
  birthDate?: string;
  image: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  ip?: string;
  role?: string;
  company?: {
    department?: string;
    name?: string;
    title?: string;
  };
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartProductInput {
  id: number;
  quantity: number;
}

export interface UpdateCartRequest {
  merge: boolean;
  products: CartProductInput[];
}

export interface ProductListResponse extends PaginationMeta {
  products: Product[];
}

export interface CartListResponse extends PaginationMeta {
  carts: Cart[];
}
