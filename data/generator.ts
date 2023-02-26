import { faker } from '@faker-js/faker';
import { Maybe, Product, Order, Categories } from './types';

function createMockProduct(productId : string, orderId: Maybe<string>): Product {
  return {
    _id: productId,
    title: faker.commerce.productName(),
    order_id: orderId,
    created_at: faker.date.past().toISOString(),
    category: faker.helpers.arrayElement<Categories>(['Clothing', 'Hats', 'Sneakers', 'Watches']),
    price: faker.commerce.price(100, 300),
  };
}

function createMockOrder(orderId: string, productId: string): Order {
  return {
    _id: orderId,
    product_id: productId,
  };
}

export function initDB() {
  return Array(50)
    .fill(null)
    .reduce<{ products: Map<string,Product>; orders: Map<string, Order> }>(
      (acc, _curr, index) => {
        const shouldInsertOrder = index % 5 === 0;

        const orderID = faker.database.mongodbObjectId();
        const productID = faker.database.mongodbObjectId();

        const product = createMockProduct(productID, shouldInsertOrder ? orderID : null);
        
        acc.products.set(productID, product);
        
        if (shouldInsertOrder) {
          acc.orders.set(orderID, createMockOrder(orderID, productID));
        }

        return acc;
      },
      {
        products: new Map<string, Product>(),
        orders: new Map<string, Order>()
      }
    );
}
