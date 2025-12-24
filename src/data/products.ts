import { Product, Category } from "@/types";

export const categories: Category[] = [
  { id: "all", name: "Барчаси", icon: "Grid3X3" },
  { id: "electronics", name: "Электроника", icon: "Smartphone" },
  { id: "clothing", name: "Кийим", icon: "Shirt" },
  { id: "home", name: "Уй учун", icon: "Home" },
  { id: "sports", name: "Спорт", icon: "Dumbbell" },
  { id: "beauty", name: "Гўзаллик", icon: "Sparkles" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Симсиз қулоқчин Pro",
    price: 450000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "electronics",
    description: "Юқори сифатли овоз ва узоқ батарея муддати",
  },
  {
    id: "2",
    name: "Ақлли соат Ultra",
    price: 890000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "electronics",
    description: "Фитнес трекер ва уйқу мониторинги",
  },
  {
    id: "3",
    name: "Эркаклар костюми",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
    category: "clothing",
    description: "Классик услубда замонавий костюм",
  },
  {
    id: "4",
    name: "Аёллар сумкаси",
    price: 380000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    category: "clothing",
    description: "Ҳақиқий терисидан тайёрланган",
  },
  {
    id: "5",
    name: "Кофе машинаси",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    category: "home",
    description: "Автоматик эспрессо ва капучино",
  },
  {
    id: "6",
    name: "Декоратив чироқ",
    price: 250000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    category: "home",
    description: "LED ёруғлик ва минимал дизайн",
  },
  {
    id: "7",
    name: "Йога гиламчаси",
    price: 180000,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    category: "sports",
    description: "Антислип юза ва қалин материал",
  },
  {
    id: "8",
    name: "Спорт чақчон",
    price: 650000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "sports",
    description: "Енгил ва қулай спорт пойабзали",
  },
  {
    id: "9",
    name: "Атир набори",
    price: 720000,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    category: "beauty",
    description: "Франция ишлаб чиқаришидан",
  },
  {
    id: "10",
    name: "Терини парвариш тўплами",
    price: 340000,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    category: "beauty",
    description: "Табиий ингредиентлар асосида",
  },
  {
    id: "11",
    name: "Портатив зарядка",
    price: 290000,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    category: "electronics",
    description: "20000mAh сиғими ва тез зарядлаш",
  },
  {
    id: "12",
    name: "Пиджак",
    price: 780000,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop",
    category: "clothing",
    description: "Ёзги енгил пиджак",
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("uz-UZ").format(price) + " сўм";
};
