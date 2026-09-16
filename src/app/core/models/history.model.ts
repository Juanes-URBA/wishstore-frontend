export interface HistoryResponse {
  id: number;
  wishlistId: number;
  productId: number;
  action: 'ADD' | 'REMOVE' | 'UPDATE';
  description: string;
  createdAt: string;
}