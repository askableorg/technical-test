import { faker } from "@faker-js/faker";
import { Product, Order, Categories, User } from "../types";

type Maybe<T> = T | null;

function createMockProduct(productId: string, orderId: Maybe<string>): Product {
    return {
        _id: productId,
        title: faker.commerce.productName(),
        order_id: orderId,
        created_at: faker.date.past().toISOString(),
        category: faker.helpers.arrayElement<Categories>([
            "Clothing",
            "Hats",
            "Sneakers",
            "Watches",
        ]),
        price: faker.commerce.price(100, 300),
        description: faker.lorem.paragraph(),
    };
}

function createMockOrder(_id: string, productId: string, user: User): Order {
    return {
        _id: _id,
        productId: productId,
        userId: user._id,
        createdDate: faker.date.past().toISOString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: "1 Main Road",
        city: "Fake City",
        state: "Fake State",
        postcode: "0000",
        shippingType: "Standard",
    };
}

export function generateProductData(users: User[]) {
    return Array(50)
        .fill(null)
        .reduce<{ products: Product[]; orders: Order[] }>(
            (acc, _curr, index) => {
                const orderID = faker.database.mongodbObjectId();
                const productID = faker.database.mongodbObjectId();
                const shouldInsertOrder = index % 5 === 0;

                if (shouldInsertOrder) {
                    const randomUser = faker.helpers.arrayElement(users);
                    acc.orders.push(createMockOrder(orderID, productID, randomUser));
                }

                const product = createMockProduct(productID, shouldInsertOrder ? orderID : null);
                acc.products.push(product);
                return acc;
            },
            {
                products: [],
                orders: [],
            }
        );
}
