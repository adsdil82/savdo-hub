export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface OrderFormData {
  customerName: string;
  phone: string;
  region: string;
}

export const UZBEKISTAN_REGIONS = [
  "Тошкент",
  "Тошкент вилояти",
  "Андижон",
  "Фарғона",
  "Наманган",
  "Самарқанд",
  "Бухоро",
  "Хоразм",
  "Қашқадарё",
  "Сурхондарё",
  "Навоий",
  "Жиззах",
  "Сирдарё",
  "Қорақалпоғистон",
] as const;

export type Region = typeof UZBEKISTAN_REGIONS[number];
