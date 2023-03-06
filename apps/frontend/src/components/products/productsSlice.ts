import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../../store";
import { TProduct } from "../../types";
import { IProductsData, IProductsState, SortAction } from "./types";

const initialState: IProductsState = {
  products: [],
  loading: false,
  error: null,
  sortBy: null,
  sortOrder: null,
};

export const fetchProductData = createAsyncThunk(
  "products/fetchData",
  async () => {
    const { data } = await axios.get("http://localhost:3000/products");
    return data;
  }
);

export const fetchOrderData = createAsyncThunk(
  "products/fetchOrders",
  async () => {
    const { data } = await axios.get("http://localhost:3000/orders");
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    const { data } = await axios.post(
      `http://localhost:3000/products/delete`,
      { id: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return id;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async () => {
    const { data } = await axios.post(
      `http://localhost:3000/products/create`,
    );

    return data;
  }
);

export const productsReducer = createSlice({
  name: "products",
  initialState,
  reducers: {
    sort: (state, action: PayloadAction<SortAction>) => {
      const { sortBy, sortOrder } = action.payload;

      return {
        ...state,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IProductsData>) => {
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
        (state, action: PayloadAction<TProduct[]>) => {
          return {
            ...state,
            products: action.payload,
            loading: false,
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
      .addCase(deleteProduct.pending, (state, _) => {
        return state;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productIndex = state.products.findIndex(
          (product) => product._id === action.payload
        );
        state.products.splice(productIndex, 1);
        return state;
      })
      .addCase(createProduct.pending, (state, _) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<TProduct[]>) => {
          return {
            ...state,
            products: action.payload,
            loading: false,
          };
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      });
  },
});

// Actions
export const { sort } = productsReducer.actions;

// Selectors
export const selectProducts = (state: RootState) => state.products;
const selectSortAttribute = (state: RootState) => state.products.sortBy;
const selectSortOrder = (state: RootState) => state.products.sortOrder;
export const selectLoadingState = (state: RootState) => state.products.loading;
export const selectSortedProducts = (state: RootState) => {
  const sortAttribute = selectSortAttribute(state);
  const sortOrder = selectSortOrder(state);
  const products = selectProducts(state).products;

  if (!sortAttribute || !sortOrder) {
    return state.products;
  }

  return {
    ...state.products,
    products: [...products].sort((a, b) => {
      if (sortOrder === "desc") {
        return parseFloat(b[sortAttribute]) - parseFloat(a[sortAttribute]);
      }
      return parseFloat(a[sortAttribute]) - parseFloat(b[sortAttribute]);
    }),
  };
};
export const selectProduct = (state: RootState, id: string) =>
  state.products.products.find((product) => product._id === id);

export default productsReducer.reducer;
