import fastify from 'fastify';
import cors from '@fastify/cors';
import { Database } from './data/Database';
import type { Product, SortBy } from './generators/productsGenerators';

type ProductParams = {
  desc?: string;
  page?: string;
  size?: string;
  sortBy?: SortBy;
};

const app = fastify();
const port = 3000;

app.register(cors, {
  origin: 'https://localhost:5173'
});

app.get('/users', async (req, res) => {
  res.send(await Database.getUsers());
});

// List Products
app.get('/products', async (req, res) => {
  try {
    const { size, page, sortBy, desc } = req.query as ProductParams;
    const response = await Database.getProducts(Number(size), Number(page), sortBy, desc === 'true' ? true : false);
    res.send(response);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// View Product by ID
app.get<{ Params: { id: string } }>('/product/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).send({ message: 'Missing product ID' });
  }

  try {
    const product = await Database.getProductById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// Create Products
app.post<{ Body: Product }>('/product', async (req, res) => {
  const newProduct = req.body;

  if (newProduct.title === '') {
    res.status(400).send({ message: 'Missing title' });
  }

  if (newProduct.price === '') {
    res.status(400).send({ message: 'Missing price' });
  }

  if (!newProduct.category) {
    res.status(400).send({ message: 'Missing category' });
  }

  try {
    const createdProduct = await Database.createProduct(newProduct);
    res.send(createdProduct);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// Delete Products
app.delete<{ Params: { id: string } }>('/product/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).send({ message: 'Missing product ID' });
  }

  try {
    const deletedProduct = await Database.deleteProductById(id);
    if (deletedProduct) {
      res.send({ message: 'Product deleted successfully' });
    } else {
      res.status(400).send({ message: 'Product not deleted' });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// List Orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Database.getOrders();
    res.send(orders);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// Purchase Product
app.post<{ Body: { id: string } }>('/order', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).send({ message: 'Missing product ID' });
  }

  try {
    const createdOrder = await Database.createOrder(id);
    res.send(createdOrder);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

app.listen({ port }, (error) => {
  if (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }

  console.log(`Server is running on port ${port}`);
});

export default app;
