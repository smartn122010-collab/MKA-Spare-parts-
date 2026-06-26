export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  inStock: boolean;
  imageUrl: string;
};

export type Offer = {
  id: string;
  code: string;
  description: string;
  discount: string;
  expiryDate: string;
};

export type AdminStats = {
  totalStock: number;
  totalServices: number;
  todaySales: number;
  monthSales: number;
  yearSales: number;
};
