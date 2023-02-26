import request from 'supertest';
import { faker } from '@faker-js/faker';
import { Database } from '../data/Database';
import { Product, Order } from '../data/types';
import app from '../app';

describe('API', () => {
  const productA = <Product> {
    _id: 'productA', 
    title: 'Product A', 
    price: '20.99',
    order_id: 'orderA',
    created_at: faker.date.past().toISOString(),
    category: 'Clothing',
  };

  const productB = <Product> {
    _id: 'productB', 
    title: 'Product B', 
    price: '15.99',
    order_id: null,
    created_at: (new Date()).toISOString(),
    category: 'Sneakers',
  };

  const orderA = <Order> { _id: 'orderA', product_id: 'productA'}

  beforeEach(() => {
    Database.getInstance().clear();
    Database.getInstance().getProducts().set(productA._id, productA);
    Database.getInstance().getProducts().set(productB._id, productB);
    Database.getInstance().getOrders().set(orderA._id, orderA);
  });

  describe('GET /products', () => {
    it('should get a list PRODUCTS', async () => {
      const res = await request(app).get('/products');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0]._id).toEqual('productA');
      expect(res.body[1]._id).toEqual('productB');
    });

    it('should limit the list if limit it defined', async () => {
      const res = await request(app).get('/products?limit=1');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]._id).toEqual('productA');
    });

    it('should sort the list by :price attribute ascendingly if price-asc is defined', async () => {
      const res = await request(app).get('/products?sort=price-asc');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0]._id).toEqual('productB');
      expect(res.body[1]._id).toEqual('productA');
    });

    it('should sort the list by :price attribute descendingly if price-desc is defined', async () => {
      const res = await request(app).get('/products?sort=price-desc');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0]._id).toEqual('productA');
      expect(res.body[1]._id).toEqual('productB');
    });

    it('should sort the list by :created_at attribute ascendingly if created-asc is defined', async () => {
      const res = await request(app).get('/products?sort=created-asc');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0]._id).toEqual('productA');
      expect(res.body[1]._id).toEqual('productB');
    });

    it('should sort the list by :created_at attribute descendingly if created-desc is defined', async () => {
      const res = await request(app).get('/products?sort=created-desc');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0]._id).toEqual('productB');
      expect(res.body[1]._id).toEqual('productA');
    });

    it('should sort the list by :price attribute ascendingly and limit', async () => {
      const res = await request(app).get('/products?limit=1&sort=price-asc');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]._id).toEqual('productB');
    });

    it('should sort the list by :price attribute descendingly and limit', async () => {
      const res = await request(app).get('/products?limit=1&sort=price-desc');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]._id).toEqual('productA');
    });

    it('should sort the list by :created_at attribute ascendingly and limit', async () => {
      const res = await request(app).get('/products?limit=1&sort=created-asc');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]._id).toEqual('productA');
    });

    it('should sort the list by :created_at attribute descendingly and limit', async () => {
      const res = await request(app).get('/products?limit=1&sort=created-desc');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]._id).toEqual('productB');
    });
  });

  describe('PUT /products', () => {
    it('should create a new PRODUCT', async () => {
      const newProduct = { title: 'Product A', price: '36.99', category: 'Clothing' };
      const res = await request(app).put('/products').send(newProduct);
      expect(res.statusCode).toEqual(201);
      expect(res.body._id).toBeDefined();
      expect(res.body.title).toEqual(newProduct.title);
      expect(res.body.price).toEqual(newProduct.price);
      expect(res.body.order_id).toBeNull();
      expect(res.body.category).toEqual(newProduct.category);
    });

    it('should raise :title attribute error if title is empty', async () => {
      const newProduct = { title: '', price: '36.99', category: 'Clothing' };
      const res = await request(app).put('/products').send(newProduct);
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Incorrect VALUE for ATTRIBUTE :title');
    });

    it('should raise :title attribute error if title is undefined', async () => {
      const newProduct = { price: '36.99', category: 'Clothing' };
      const res = await request(app).put('/products').send(newProduct);
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Incorrect VALUE for ATTRIBUTE :title');
    });

    it('should raise :price attribute error if price is negative', async () => {
      const newProduct = { title: 'Product A', price: '-36.99', category: 'Clothing' };
      const res = await request(app).put('/products').send(newProduct);
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Incorrect VALUE for ATTRIBUTE :price');
    });

    it('should raise :price attribute error if price has incorrect number', async () => {
      const newProduct = { title: 'Product A', price: 'A36.99', category: 'Clothing' };
      const res = await request(app).put('/products').send(newProduct);
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Incorrect VALUE for ATTRIBUTE :price');
    });

    it('should raise :price attribute error if price is undefined', async () => {
      const newProduct = { title: 'Product A', category: 'Clothing' };
      const res = await request(app).put('/products').send(newProduct);
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Incorrect VALUE for ATTRIBUTE :price');
    });

    it('should raise :category attribute error if category has incorrect value', async () => {
      const newProduct = { title: 'Product A', price: '36.99', category: 'Incorrect Category' };
      const res = await request(app).put('/products').send(newProduct);
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Incorrect VALUE for ATTRIBUTE :category');
    });

    it('should raise :category attribute error if category is undefined', async () => {
      const newProduct = { title: 'Product A', price: '36.99' };
      const res = await request(app).put('/products').send(newProduct);
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Incorrect VALUE for ATTRIBUTE :category');
    });
  });

  describe('GET /products/:productId', () => {
    it('should get PRODUCT by :productId', async () => {
      const res = await request(app).get('/products/productA');
      expect(res.body).toEqual(productA);
    });

    it('should raise an error if PRODUCT is not found', async () => {
      const res = await request(app).get('/products/productC');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Can not FIND the PRODUCT with _ID productC');
    });
  });
  
  describe('GET /products/orders/:orderId', () => {
    it('should get PRODUCT by :orderId', async () => {
      const res = await request(app).get('/products/orders/orderA');
      expect(res.body).toEqual(productA);
    });

    it('should raise an error if ORDER is not found', async () => {
      const res = await request(app).get('/products/orders/orderC');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Can not FIND the ORDER with _ID orderC');
    });
  });
  
  describe('DELETE /products/:productId', () => {
    it('should delete PRODUCT by :productId', async () => {
      const res = await request(app).delete('/products/productB');
      expect(res.body).toEqual({ deleted: true, product: productB, order: null });
    });

    it('should delete PRODUCT by :productId and associated ORDER as well', async () => {
      const res = await request(app).delete('/products/productA');
      expect(res.body).toEqual({ deleted: true, product: productA, order: orderA });
    });
  });

  describe('GET /orders/:orderId', () => {
    it('should get ORDER by :orderId', async () => {
      const res = await request(app).get('/orders/orderA');
      expect(res.body).toEqual(orderA);
    });
    
    it('should raise an error if ORDER is not found', async () => {
      const res = await request(app).get('/orders/orderC');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Can not FIND the ORDER with _ID orderC');
    });
  });

  describe('PUT /orders/', () => {
    it('should create an ORDER', async () => {
      const res = await request(app).put('/orders/').send({ productId: 'productB' });
      expect(res.statusCode).toEqual(201);
      expect(res.body._id).toBeDefined();
      expect(res.body.product_id).toEqual('productB');
    });
    
    it('should raise an error if PRODUCT is already purchased', async () => {
      const res = await request(app).put('/orders/').send({ productId: 'productA' });
      expect(res.statusCode).toEqual(406);
      expect(res.body.error).toEqual('Can not PURCHASE the PRODUCT with _ID productA it already has associated ORDER');
    });

    it('should raise an error if :productId is undefined', async () => {
      const res = await request(app).put('/orders/');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Can not FIND the PRODUCT with _ID undefined');
    });
    
    it('should raise an error if PRODUCT is not found', async () => {
      const res = await request(app).put('/orders/').send({ productId: 'productC'});
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Can not FIND the PRODUCT with _ID productC');
    });

  });
});
