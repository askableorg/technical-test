import { faker } from '@faker-js/faker';
import { ApiErrors } from './messages';
import { Categories, generateProductData, Order, Product } from './generator';

/**
 * Treat this as a fake local database.
 * Implement functions that will help you create/read/update/delete the mocked data
 */
export class Database {
  private static data = generateProductData();
  
  static async getProducts() {
    return this.data.products;
  }

  static async getOrders() {
    return this.data.orders;
  }

  static async getProductById(productId: string): Promise<Product> {
    const product: Product | undefined = this.data.products.find(product => product._id === productId);
    if (!product) throw Error(ApiErrors.PRODUCT_NOT_FOUND(productId));
    return product
  }

  static async getOrderByOrderId(orderId: string): Promise<Order> {
    const order: Order | undefined = this.data.orders.find(order => order._id === orderId);
    if (!order) throw Error(ApiErrors.ORDER_NOT_FOUND(orderId));
    return order;
  }

  static async getOrderByProductId(productId: string): Promise<Order | undefined> {
    const order: Order | undefined = this.data.orders.find(order => order.product_id === productId);
    return order;
  }

  static async createNewProduct(title: string, category: Categories, price: string): Promise<Product> {
    const currentDate = new Date();
    const _product: Product = {
      _id: faker.database.mongodbObjectId(),
      title: title,
      created_at: currentDate.toISOString(),
      category: category,
      price: price,
      order_id: null
    };
    this.data.products = [...this.data.products, _product];
    return _product;
  }

  static async createNewOrder(productId: string): Promise<Order> {
    const _product: Product | undefined = this.data.products.find(product => product._id === productId);
    if (!_product) throw Error(ApiErrors.PRODUCT_NOT_FOUND(productId));

    const existingOrder: Order | undefined = this.data.orders.find(order => order.product_id === productId);
    
    if (!!existingOrder) throw Error(ApiErrors.PRODUCT_WAS_ALREADY_PURCHASED(productId));
   
    const _order: Order = {
      _id: faker.database.mongodbObjectId(),
     product_id: productId
    };

    _product.order_id = _order._id;

    this.data.orders = [...this.data.orders, _order];
    return _order;
  }


  static async deleteProductById(productId: string): Promise<Product> {
    const productIndex =  this.data.products.findIndex(product => product._id === productId);
    if (productIndex < 0) throw Error(ApiErrors.PRODUCT_NOT_FOUND(productId));

    const order: Order | undefined = await this.getOrderByProductId(productId);

    if (!!order) {
      await this.deleteOrderById(order._id);
    }

    const product = this.data.products[productIndex];
    this.data.products.splice(productIndex, 1);

    return product;
  }

  static async deleteOrderById(orderId: string): Promise<Order> {
    const orderIndex =  this.data.orders.findIndex(order => order._id === orderId);
    if (orderIndex < 0) throw Error(ApiErrors.ORDER_NOT_FOUND(orderId));

    const order = this.data.orders[orderIndex];
    this.data.orders.splice(orderIndex, 1);

    return order;
  }



}

