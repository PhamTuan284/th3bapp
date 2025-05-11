export type ClothingItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  sizes: {
    [key: string]: number; // size: quantity
  };
  image: string;
  note?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type StoreStats = {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  categories: {
    [key: string]: number;
  };
} 