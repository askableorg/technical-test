import { faker } from '@faker-js/faker';
import { generateProductData } from '../generators/productsGenerators';
import { generateUserData } from '../generators/usersGenerator';
import type { Product, Order, SortBy } from '../generators/productsGenerators';

const sortByField = <T, K extends keyof T>(items: T[], sortBy: K, desc: boolean): T[] => {
  if (items.length === 0) {
    return items;
  }

  const sortOrder = desc ? -1 : 1;

  return items.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) {
      return -1 * sortOrder;
    }

    if (aValue > bValue) {
      return 1 * sortOrder;
    }

    return 0;
  });
};

/**
 * Treat this as a fake local database.
 * Implement functions that will help you create/read/update/delete the mocked data
 */
export class Database {
  private static data = { ...generateProductData(), ...generateUserData() };

  static async getUsers() {
    return this.data.users;
  }

  static async getProducts(size = 50, page = 1, sortBy: SortBy = 'title', desc = false) {
    const sortedProducts = sortByField([...this.data.products], sortBy, desc);
    return size > 0 ? sortedProducts.slice(page > 0 ? page - 1 : 0, size) : sortedProducts;
  }

  static async getProductById(id: string) {
    return this.data.products.find((product) => product._id === id) ?? null;
  }

  static async createProduct(newProduct: Product) {
    const productWithId: Product = { ...newProduct, _id: faker.database.mongodbObjectId() };
    this.data.products.push(productWithId);

    return productWithId;
  }

  static async deleteProductById(id: string) {
    const index = this.data.products.findIndex((product) => product._id === id);

    if (index !== -1) {
      // Remove the associated order
      this.data.orders.filter((order: Order) => order.product_id === id);
      return this.data.products.splice(index, 1)[0];
    }

    return null;
  }

  static async getOrders() {
    const orders = sortByField([...this.data.orders], 'created_at', true);
    // Add the full product data to each order

    return orders.map((order: Order) => {
      return {
        ...order,
        product: this.data.products.find((product) => product._id === order.product_id)
      };
    });
  }

  static async createOrder(productId: string) {
    const orderId = faker.database.mongodbObjectId();

    const orderWithId: Order = {
      _id: orderId,
      product_id: productId,
      created_at: new Date().toISOString()
    };

    this.data.orders.push(orderWithId);

    // Add order ID to relevant product
    this.data.products = this.data.products.map((product) =>
      product._id === productId ? { ...product, order_id: orderId } : product
    );

    return orderWithId;
  }
}

export type { Product, Order };
