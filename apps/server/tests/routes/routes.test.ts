import { createServer } from "../../index";
import { FastifyInstance } from "fastify";

describe("Routes", () => {
    let fastify: FastifyInstance;

    beforeAll(() => {
        fastify = createServer();
    });

    afterAll(() => {
        fastify.close();
    });

    describe("API Routes", () => {
        it("should return all products", async () => {
            const response = await fastify.inject({
                method: "GET",
                url: "/products",
            });
            expect(response.statusCode).toBe(200);

            const products = JSON.parse(response.body);
            expect(Array.isArray(products)).toBe(true);
            expect(products.length).toBeGreaterThan(0);

            if (products.length > 0) {
                const product = products[0];
                expect(product).toHaveProperty("title");
                expect(product).toHaveProperty("description");
                expect(product).toHaveProperty("price");
            }
        });

        it("should return a product when a valid product id is provided", async () => {
            const createResponse = await fastify.inject({
                method: "POST",
                url: "/products",
                payload: {
                    title: "Test Product",
                    category: "Clothing",
                    price: 100,
                    description: "This is a test product",
                },
            });

            const createdProduct = JSON.parse(createResponse.body);
            const response = await fastify.inject({
                method: "GET",
                url: `/products/${createdProduct._id}`,
            });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body).title).toBe("Test Product");
        });

        it("should return a 404 error when an invalid product id is provided", async () => {
            const response = await fastify.inject({
                method: "GET",
                url: "/products/999999",
            });
            expect(response.statusCode).toBe(404);
        });

        it("should return a 200 status code and all users", async () => {
            const response = await fastify.inject({
                method: "GET",
                url: "/users",
            });
            const responseBody = JSON.parse(response.body);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(responseBody)).toBe(true);
            expect(responseBody.length).toBeGreaterThan(0);

            const firstUser = responseBody[0];
            expect(firstUser).toHaveProperty("_id");
            expect(firstUser).toHaveProperty("firstName");
        });

        it("should create a new product and return it with a 201 status code when valid data is provided", async () => {
            const productData = {
                title: "New Product",
                category: "Sneakers",
                price: "19.99",
                description: "This is a description of the new product",
            };
            const response = await fastify.inject({
                method: "POST",
                url: "/products",
                payload: productData,
            });
            expect(response.statusCode).toBe(201);
            const createdProduct = JSON.parse(response.body);
            expect(createdProduct).toEqual({
                ...productData,
                _id: expect.any(String),
                created_at: expect.any(String),
            });
        });

        it("should return a 400 error when invalid product creation data is provided", async () => {
            const response = await fastify.inject({
                method: "POST",
                url: "/products",
                payload: {
                    name: "",
                    price: -1,
                },
            });
            expect(response.statusCode).toBe(400);
        });

        it("should return the order associated with a product id when a valid order id is provided", async () => {
            const createProductResponse = await fastify.inject({
                method: "POST",
                url: "/products",
                payload: {
                    title: "New Product",
                    category: "Sneakers",
                    price: "19.99",
                    description: "This is a description of the new product",
                },
            });

            const createdProduct = JSON.parse(createProductResponse.body);

            const createOrderResponse = await fastify.inject({
                method: "POST",
                url: `/products/${createdProduct._id}/purchase`,
                payload: {
                    productId: createdProduct._id,
                    createdDate: new Date().toISOString(),
                    shippingType: "Standard",
                    address: "123 Main St",
                    city: "Test City",
                    state: "TS",
                    postcode: "12345",
                    userId: "user123",
                    firstName: "Test",
                    lastName: "User",
                    email: "testuser@example.com",
                    cardNumber: "4111111111111111",
                    expiryDate: "12/23",
                    cvv: "123",
                },
            });

            const createdOrder = JSON.parse(createOrderResponse.body);

            const getOrderResponse = await fastify.inject({
                method: "GET",
                url: `/products/orders/${createdOrder.order._id}`,
            });

            expect(getOrderResponse.statusCode).toBe(200);
            expect(JSON.parse(getOrderResponse.body).order).toEqual(createdOrder.order);
        });

        it("Should return a 404 error when an invalid order id is provided", async () => {
            const getOrderResponse = await fastify.inject({
                method: "GET",
                url: "/products/orders/fakeid",
            });

            expect(getOrderResponse.statusCode).toBe(404);
        });

        it("should delete a product and its associated order when a valid id is provided", async () => {
            const createProductResponse = await fastify.inject({
                method: "POST",
                url: "/products",
                payload: {
                    title: "Product to delete",
                    category: "Sneakers",
                    price: "19.99",
                    description: "This product will be deleted",
                },
            });
            const createdProduct = JSON.parse(createProductResponse.body);

            const createOrderResponse = await fastify.inject({
                method: "POST",
                url: `/products/${createdProduct._id}/purchase`,
                payload: {
                    productId: createdProduct._id,
                    createdDate: new Date().toISOString(),
                    shippingType: "Standard",
                    address: "123 Main St",
                    city: "Test City",
                    state: "TS",
                    postcode: "12345",
                    userId: "user123",
                    firstName: "Test",
                    lastName: "User",
                    email: "testuser@example.com",
                    cardNumber: "4111111111111111",
                    expiryDate: "12/23",
                    cvv: "123",
                },
            });
            const createdOrder = JSON.parse(createOrderResponse.body);

            const deleteResponse = await fastify.inject({
                method: "DELETE",
                url: `/products/${createdProduct._id}`,
            });
            expect(deleteResponse.statusCode).toBe(200);

            const getProductResponse = await fastify.inject({
                method: "GET",
                url: `/products/${createdProduct._id}`,
            });
            expect(getProductResponse.statusCode).toBe(404);

            const getOrderResponse = await fastify.inject({
                method: "GET",
                url: `/products/orders/${createdOrder.order._id}`,
            });
            expect(getOrderResponse.statusCode).toBe(404);
        });

        it("should not delete anything when product id is invalid", async () => {
            const nonexistentResponse = await fastify.inject({
                method: "DELETE",
                url: "/products/999999",
            });
            expect(nonexistentResponse.statusCode).toBe(404);
        });

        it("should create an order for a product and return it when valid data is provided", async () => {
            const createProductResponse = await fastify.inject({
                method: "POST",
                url: "/products",
                payload: {
                    title: "New Product",
                    category: "Sneakers",
                    price: "19.99",
                    description: "This is a description of the new product",
                },
            });

            const createdProduct = JSON.parse(createProductResponse.body);

            const createOrderResponse = await fastify.inject({
                method: "POST",
                url: `/products/${createdProduct._id}/purchase`,
                payload: {
                    productId: createdProduct._id,
                    createdDate: new Date().toISOString(),
                    shippingType: "Standard",
                    address: "123 Main St",
                    city: "Test City",
                    state: "TS",
                    postcode: "12345",
                    userId: "user123",
                    firstName: "Test",
                    lastName: "User",
                    email: "testuser@example.com",
                    cardNumber: "4111111111111111",
                    expiryDate: "12/23",
                    cvv: "123",
                },
            });

            expect(createOrderResponse.statusCode).toBe(200);
            const createdOrder = JSON.parse(createOrderResponse.body);
            expect(createdOrder).toHaveProperty("order");
            expect(createdOrder.order).toHaveProperty("_id");
            expect(createdOrder.order.productId).toEqual(createdProduct._id);
        });

        it("should return a 400 error when invalid data is provided", async () => {
            const createProductResponse = await fastify.inject({
                method: "POST",
                url: "/products",
                payload: {
                    title: "New Product",
                    category: "Sneakers",
                    price: "19.99",
                    description: "This is a description of the new product",
                },
            });

            const createdProduct = JSON.parse(createProductResponse.body);

            const createOrderResponse = await fastify.inject({
                method: "POST",
                url: `/products/${createdProduct._id}/purchase`,
                payload: {},
            });

            expect(createOrderResponse.statusCode).toBe(400);
        });

        it("should return a 400 error when the product id is invalid", async () => {
            const createOrderResponse = await fastify.inject({
                method: "POST",
                url: "/products/999999/purchase",
                payload: {
                    productId: "999999",
                    createdDate: new Date().toISOString(),
                    shippingType: "Standard",
                    address: "123 Main St",
                    city: "Test City",
                    state: "TS",
                    postcode: "12345",
                    userId: "user123",
                    firstName: "Test",
                    lastName: "User",
                    email: "testuser@example.com",
                    cardNumber: "4111111111111111",
                    expiryDate: "12/23",
                    cvv: "123",
                },
            });

            expect(createOrderResponse.statusCode).toBe(400);
        });

        it("should create a new user and return it when valid data is provided", async () => {
            const validUserData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "strongpassword123",
                dob: "1990-01-01T00:00:00.000Z",
                isAdmin: false,
            };

            const response = await fastify.inject({
                method: "POST",
                url: "/users",
                payload: validUserData,
            });

            expect(response.statusCode).toBe(200);

            const responseBody = JSON.parse(response.body);

            const { password, ...expectedUserData } = validUserData;

            expect(responseBody).toMatchObject(expectedUserData);
        });

        it("should return a 400 error when invalid data is provided", async () => {
            const invalidUserData = {
                firstName: "",
                lastName: "Doe",
                email: "not-an-email",
                password: "short",
                dob: "not-a-date",
            };

            const response = await fastify.inject({
                method: "POST",
                url: "/users",
                payload: invalidUserData,
            });

            expect(response.statusCode).toBe(400);
        });

        it("should login a user and return a success message when valid credentials are provided", async () => {
            const createUserResponse = await fastify.inject({
                method: "POST",
                url: "/users",
                payload: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "johnlogintest@example.com",
                    password: "password123",
                    dob: "1990-01-01T00:00:00.000Z",
                    isAdmin: false,
                },
            });

            expect(createUserResponse.statusCode).toBe(200);

            const validCredentials = {
                email: "johnlogintest@example.com",
                password: "password123",
            };

            const loginResponse = await fastify.inject({
                method: "POST",
                url: "/login",
                payload: validCredentials,
            });

            console.log(loginResponse);
            expect(loginResponse.statusCode).toBe(200);
            const loginResponseBody = JSON.parse(loginResponse.body);
            expect(loginResponseBody.message).toBe("Login successful");
            expect(loginResponseBody.user).toMatchObject({
                email: validCredentials.email,
            });
        });

        it("should return a 401 error when invalid login credentials are provided", async () => {
            const loginResponse = await fastify.inject({
                method: "POST",
                url: "/login",
                payload: {
                    email: "nonexistent@example.com",
                    password: "wrongpassword",
                },
            });

            expect(loginResponse.statusCode).toBe(401);

            const loginResponseBody = JSON.parse(loginResponse.body);
            expect(loginResponseBody.error).toBe("Invalid credentials");
        });
    });
});
