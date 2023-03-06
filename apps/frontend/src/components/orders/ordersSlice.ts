import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store";

import { IOrdersData, IOrdersState } from "./types";

const initialState: IOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrderData = createAsyncThunk(
  "products/fetchOrders",
  async () => {
    const { data } = await axios.get("http://localhost:3000/orders");
    return data;
  }
);

export const ordersReducer = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<IOrdersData>) => {
    builder
      .addCase(fetchOrderData.pending, (state, _) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(fetchOrderData.fulfilled, (state, action) => {
        return {
          ...state,
          orders: action.payload,
          loading: false,
        };
      })
      .addCase(fetchOrderData.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      });
  },
});

// Selector
export const selectOrders = (state: RootState) => state.orders;

export default ordersReducer.reducer;
