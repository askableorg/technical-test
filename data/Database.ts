import { faker } from '@faker-js/faker';
import { Maybe, Product, Order, Categories, isCategory, isPrice } from './types';
import { initDB } from './generator';
import { ProductNotFoundError, OrderNotFoundError, ProductPurchasedError, ProductAttributeError } from './errors';

/**
 * Treat this as a fake local database.
 * Implement functions that will help you create/read/update/delete the mocked data
 */
export class Database {
  private static instance : Database;

  private data : any; 
  
  constructor() {
    this.data = initDB();
  }
  
  public static getInstance() : Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
  
  clear() {
    this.data.products.clear();
    this.data.orders.clear();
  }

  getProducts() {
    return this.data.products;
  }
  
  getOrders() {
    return this.data.orders;
  }
  
  getProduct(productId : Maybe<string>) : Product {
    if (!this.data.products.has(productId)) throw new ProductNotFoundError(productId as string);
    
    return this.data.products.get(productId);
  }

  getOrder(orderId : Maybe<string>) : Order {
    if (!this.data.orders.has(orderId)) throw new OrderNotFoundError(orderId as string);

    return this.data.orders.get(orderId);
  }

  createProduct(title : string, price : string, category : Categories) {
    if (!title) throw new ProductAttributeError('title');
    if (!isPrice(price)) throw new ProductAttributeError('price');
    if (!isCategory(category)) throw new ProductAttributeError('category');
  
  
    const newProduct = <Product> {
      _id: this.generateId(), 
      title: title, 
      price: price,
      order_id: null,
      created_at: (new Date()).toISOString(),
      category: category,
    };

    this.data.products.set(newProduct._id, newProduct);
    
    return newProduct;
  }

  createOrder(productId: string) {
    const product = this.getProduct(productId);
    
    if (product.order_id) throw new ProductPurchasedError(productId); // product is already sold

    const newOrder = <Order> {
      _id: this.generateId(),
      product_id: productId
    }

    product.order_id = newOrder._id
    this.data.orders.set(newOrder._id, newOrder);
    
    return newOrder;
  }

  deleteProduct(productId : string) : Product {
    const product = this.getProduct(productId)
    this.data.products.delete(productId);

    return product;
  }

  deleteOrder(orderId : Maybe<string>) : Maybe<Order> {
    if (!orderId) return null;

    const order = this.getOrder(orderId);
    this.data.orders.delete(orderId);
    
    return order;
  }

  private generateId() {
    return faker.database.mongodbObjectId();
  }
}
