const API_URL = import.meta.env.VITE_API_URL;

export default {
  products: `${API_URL}/products`,
  product: `${API_URL}/product`,
  orders: `${API_URL}/orders`,
  order: `${API_URL}/order`,
  users: `${API_URL}/users`
};
