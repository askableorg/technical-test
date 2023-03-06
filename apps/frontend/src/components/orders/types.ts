import { WithId } from "../../types";

export type TOrder = WithId<{
  product_id: string;
}>;

export interface IOrdersData {
  orders: TOrder[];
}

export interface IOrdersState extends IOrdersData {
  loading: boolean;
  error: any;
}