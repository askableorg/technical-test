import { faker } from "@faker-js/faker";
import { generateProductData } from "../generators/productsGenerators";
import { generateUserData } from "../generators/usersGenerator";
import { Product, Order, User, UserRequest, ProductRequest, OrderRequest } from "../types";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export class Database {
    private static data = (() => {
        const userData = generateUserData();
        const productData = generateProductData(userData.users);
        return { ...userData, ...productData };
    })();

    // Get all products
    static async getProducts() {
        return this.data.products;
    }

    // Create a product
    static async createProduct(product: ProductRequest) {
        const newProduct: Product = {
            ...product,
            _id: faker.database.mongodbObjectId(),
            created_at: new Date().toISOString(),
        };
        this.data.products.push(newProduct);
        return newProduct;
    }

    // Get a product details
    static async getProductById(id: string) {
        return this.data.products.find((product) => product._id === id);
    }

    // Delete a product and any associated order
    static async deleteProductAndOrder(productId: string): Promise<boolean> {
        const productIndex = this.data.products.findIndex((product) => product._id === productId);
        if (productIndex === -1) {
            return false;
        }
        this.data.products.splice(productIndex, 1);
        this.data.orders = this.data.orders.filter((order) => order.productId !== productId);
        return true;
    }

    // Get an order details
    static async getOrder(orderId: string) {
        const order = this.data.orders.find((order) => order._id === orderId);
        if (!order) {
            return order;
        }
        console.log({
            order: order,
            product: this.data.products.find((product) => product._id === order?.productId),
            user: this.data.users.find((user) => user._id === order?.userId),
        });
        return {
            order: order,
            product: this.data.products.find((product) => product._id === order?.productId),
            user: this.data.users.find((user) => user._id === order?.userId),
        };
    }

    // Create an order
    static async createOrderForProduct(productId: string, orderReq: OrderRequest) {
        const productIndex = this.data.products.findIndex((product) => product._id === productId);
        if (productIndex === -1) {
            return null;
        }

        const order: Order = {
            ...orderReq,
            _id: faker.database.mongodbObjectId(),
            productId: productId,
            userId: orderReq.userId,
            createdDate: new Date().toISOString(),
        };
        this.data.orders.push(order);
        this.data.products[productIndex].order_id = order._id;
        return order;
    }

    // Get all users
    static async getUsers() {
        return this.data.users.map((user) => this.sanitizeUser(user));
    }

    // Create a user
    static async createUser(user: UserRequest) {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        const newUser: User = {
            ...user,
            _id: faker.database.mongodbObjectId(),
            password: hashedPassword,
            dob: new Date(user.dob),
        };
        this.data.users.push(newUser);
        return this.sanitizeUser(newUser);
    }

    // Get a user by email
    static async getUserByEmail(email: string): Promise<User | null> {
        return this.data.users.find((user) => user.email === email) || null;
    }

    // Compaore user passwords
    static async compareUserPassword(
        providedPassword: string,
        passwordHash: string
    ): Promise<boolean> {
        return bcrypt.compare(providedPassword, passwordHash);
    }

    // Check if user is an admin
    static async isUserAdmin(id: string): Promise<boolean> {
        const user = this.data.users.find((user) => user._id === id);
        return user ? user.isAdmin : false;
    }

    // Remove user password
    static sanitizeUser(user: User): Omit<User, "password"> {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
