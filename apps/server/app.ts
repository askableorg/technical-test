import fastify from 'fastify';
import cors from '@fastify/cors'

import { Database } from './data/Database';

const app = fastify();

const registerCors = async () => {
  await app.register(cors, {});
} 

registerCors();

//View X amount of products that are sortable by either created date or price
app.get('/products', async (req, res) => {
  const products = await Database.getProducts();
  res.send(products);
});

//View all orders
app.get('/orders', async (req, res) => {
  const orders = await Database.getOrders();
  res.send(orders);
});

// View a single product by ID
app.get('/products/:productId', async (req: any, res) => {
  const params = req.params;
  const { productId } = params;
  const product = await Database.getProductById(productId);
  res.send(product);
});

// Create a new product
app.post('/products', async (req: any, res) => {
  const body = req.body;
  const { title, price, category } = body;
  const product = await Database.createNewProduct(title, category, price);
  res.send(product);
});

// Purchase a product
app.put('/products/:productId', async (req: any, res) => {
  const params = req.params;
  const { productId } = params;
  const order = await Database.createNewOrder(productId);
  res.send(order);
});

// View single order product order details (if it exists)
app.get('/orders/:orderId', async (req: any, res) => {
  const params = req.params;
  const { orderId } = params;
  const order = await Database.getOrderByOrderId(orderId);
  res.send(order);
});

//Delete a product by Id AND order associated with it (if it exists)
app.delete('/products/:productId', async (req: any, res) => {
  const params = req.params;
  const { productId } = params;
  const product = await Database.deleteProductById(productId);
  res.send(product);
});

export default app