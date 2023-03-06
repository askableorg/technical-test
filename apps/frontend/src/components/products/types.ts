import { Maybe, TProduct } from "../../types";

export interface IProductsData {
  products: TProduct[];
}

export type SortBy = "created_at" | "price";
export type SortOrder = "asc" | "desc";

export type SortAction = {
  sortBy: Maybe<SortBy>;
  sortOrder: Maybe<SortOrder>;
};

export type SelectOptionLabel<T> = T & {
  label: string;
};

export type SelectOption = SelectOptionLabel<SortAction>;

export interface IProductsState extends IProductsData {
  loading: boolean;
  error: any;
  sortBy: Maybe<SortBy>;
  sortOrder: Maybe<SortOrder>;
}
