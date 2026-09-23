export interface WishlistRequest {
  userId: number;
  productId: number;
}

export interface WishlistResponse {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  outOfStock: boolean;
}