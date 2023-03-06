import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../../store";
import { TProduct } from "../../types";

interface IProductState {
  product: TProduct;
  loading: boolean;
  error: any;
}

const initialState: IProductState = {
  loading: false,
  error: null,
  product: {
    _id: "0",
    title: "",
    order_id: null,
    category: null,
    created_at: "",
    price: "0",
  },
};

export const fetchProductData = createAsyncThunk(
  "product/fetchData",
  async (id: string) => {
    const { data } = await axios.get(`http://localhost:3000/products/${id}`);
    return data;
  }
);

export const purchaseProduct = createAsyncThunk(
  "product/purchaseItem",
  async (id: string) => {
    const { data } = await axios.post(
      `http://localhost:3000/products/${id}/purchase`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  }
);

export const productReducer = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<IProductState>) => {
    builder
      .addCase(fetchProductData.pending, (state, _) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .addCase(
        fetchProductData.fulfilled,
        (state, action: PayloadAction<TProduct>) => {
          return {
            ...state,
            loading: false,
            product: action.payload,
          };
        }
      )
      .addCase(fetchProductData.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      })
      .addCase(purchaseProduct.pending, (state, _) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .addCase(
        purchaseProduct.fulfilled,
        (state, action: PayloadAction<TProduct>) => {
          return {
            ...state,
            product: action.payload,
            loading: false,
          };
        }
      )
      .addCase(purchaseProduct.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      });
  },
});

export const selectProduct = (state: RootState) => state.product;
export const selectLoading = (state: RootState) => state.product.loading;

export default productReducer.reducer;
