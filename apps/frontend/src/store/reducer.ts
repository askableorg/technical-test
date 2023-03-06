import { combineReducers } from "redux";

import productsReducer from "../components/products/productsSlice";
import productReducer from "../components/product/productSlice";
import ordersReducer from "../components/orders/ordersSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  product: productReducer,
  orders: ordersReducer,
});

export default rootReducer;