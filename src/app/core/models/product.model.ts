export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string | null;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}