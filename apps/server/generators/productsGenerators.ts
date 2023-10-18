import { faker } from '@faker-js/faker';

export type Maybe<T> = T | null;

export type Categories = 'Sneakers' | 'Clothing' | 'Watches' | 'Hats';

type WithId<T> = T & {
  _id: string;
};

export type Product = WithId<{
  title: string;
  order_id: Maybe<string>;
  category: Categories;
  created_at: string;
  price: string;
}>;

export type Order = WithId<{
  product_id: string;
  created_at: string;
}>;

export type SortBy = 'title' | 'price' | 'created_at';

function createMockProduct(orderId: Maybe<string>): Product {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    order_id: orderId,
    created_at: faker.date.past().toISOString(),
    category: faker.helpers.arrayElement<Categories>(['Clothing', 'Hats', 'Sneakers', 'Watches']),
    price: faker.commerce.price(100, 300)
  };
}

function createMockOrder(_id: string, productId: string): Order {
  return {
    _id: faker.database.mongodbObjectId(),
    product_id: productId,
    created_at: faker.date.past().toISOString()
  };
}

export function generateProductData() {
  return Array(50)
    .fill(null)
    .reduce<{ products: Product[]; orders: Order[] }>(
      (acc, _curr, index) => {
        const orderID = faker.database.mongodbObjectId();
        const productID = faker.database.mongodbObjectId();

        const shouldInsertOrder = index % 5 === 0;

        if (shouldInsertOrder) {
          acc.orders.push(createMockOrder(orderID, productID));
        }

        const product = createMockProduct(shouldInsertOrder ? orderID : null);
        acc.products.push(product);
        return acc;
      },
      {
        products: [],
        orders: []
      }
    );
}
