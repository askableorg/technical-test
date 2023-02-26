import express from 'express';
import { ProductsController } from './controllers/ProductsController';
import { OrdersController } from './controllers/OrdersController';

const app = express();

const productsController = new ProductsController();
const ordersController = new OrdersController();

app.get('/products', async (request, response) => {
  productsController.setContext(request, response);
  productsController.index(request.query);
});

app.get('/products/:productId', async (request, response) => {
  productsController.setContext(request, response);
  productsController.show(request.params.productId);
});

app.get('/products/orders/:orderId', async (request, response) => {
  productsController.setContext(request, response);
  productsController.showByOrder(request.params.orderId);
});

app.put('/products', express.json({type: '*/*'}), async (request, response) => {
  productsController.setContext(request, response);
  productsController.create(request.body);
});

app.delete('/products/:productId', async (request, response) => {
  productsController.setContext(request, response);
  productsController.delete(request.params.productId);
});

app.put('/orders', express.json({type: '*/*'}), async (request, response) => {
  ordersController.setContext(request, response);
  ordersController.create(request.body);
});

app.get('/orders/:orderId', async (request, response) => {
  ordersController.setContext(request, response);
  ordersController.show(request.params.orderId);
});

export default app;