export type Maybe<T> = T | null;

export type Categories = 'Sneakers' | 'Clothing' | 'Watches' | 'Hats';
export type SortBy = 'price-asc' | 'price-desc' | 'created-asc' | 'created-desc';

type WithId<T> = T & {
  _id: string;
};

export type Product = WithId<{
  _id: string;
  title: string;
  order_id: Maybe<string>;
  category: Categories;
  created_at: string;
  price: string;
}>;

export type Order = WithId<{
  product_id: string;
}>;

export function isCategory(value: string): value is Categories {
  return ['Sneakers', 'Clothing', 'Watches', 'Hats'].includes(value);
}

export function isPrice(price: string) {
  const convertedPrice = parseFloat(price);
  return convertedPrice > 0 && convertedPrice
}