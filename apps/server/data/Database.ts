import { generateOrder, generateProductData, generateSingleProduct, Order, Product } from './generator';

/**
 * Treat this as a fake local database.
 * Implement functions that will help you create/read/update/delete the mocked data
 */
export class Database {
  private static data = generateProductData();

  static async resetData() {
    this.data = generateProductData();
  }

  static async getProducts() {
    return this.data.products;
  }

  static async getOrders() {
    return this.data.orders;
  }
  
  static async getProductById(id: string) {
    const product = this.data.products.find((p: Product) => p._id === id);
    
    if (!product) {
      throw new Error('Matching product not found')
    }

    return product;
  }

  static async addProduct() {
    const newProduct = generateSingleProduct();
    this.data.products.push(newProduct);
    return this.data.products;
  }

  static async updateProductOrderStatus(id: string, orderId: String) {
    const updatedProducts = this.data.products.map((product: Product) => {
      if (product._id !== id) {
        return product;
      }

      return {
        ...product,
        order_id: orderId,
      }
    });

    this.data.products = updatedProducts;
  }

  static async getOrderById(id: String) {
    const order = this.data.orders.find((o: Order) => o._id === id);

    if (!order) {
      throw new Error('Matching order not found');
    }

    return order;
  }

  static async getOrderByProductId(id: string) {
    const prod = await this.getProductById(id);
    if (prod) {
      if (prod.order_id) {
        const order = await this.getOrderById(prod.order_id);
        return order;
      }

      return null;
    }

    return null;
  }

  static async addOrder(productId: string) {
    const hasOrder = await this.getOrderByProductId(productId);
    if (hasOrder) {
      throw new Error('Product is sold out');
    }

    const order = generateOrder(productId);
    this.data.orders.push(order);
    await this.updateProductOrderStatus(productId, order._id);
  }

  static async deleteOrder(id: String) {
    const index = this.data.orders.findIndex((o) => o._id === id);
    if (index > -1) {
      this.data.orders.splice(index, 1);
    }
  }

  static async deleteProductById(id: string) {
    const product = await this.getProductById(id);
    if (product && product.order_id) {
      await this.deleteOrder(product.order_id);
    }

    const index = this.data.products.findIndex((p) => p._id === id);
    if (index > -1) {
      this.data.products.splice(index, 1);
    }

    return this.data.products;
  }
}
