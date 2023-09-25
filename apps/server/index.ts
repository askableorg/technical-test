import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { Database } from "./data/Database";
import { UserRequest, ProductRequest, OrderRequest } from "./types";
import { createProductRequestSchema } from "./validation/productSchema";
import { createUserRequestSchema } from "./validation/userSchema";
import { createOrderRequestSchema } from "./validation/orderSchema";

export function createServer(): FastifyInstance {
    const app = fastify();

    app.register(cors, {});

    // Get all products
    app.get("/products", async (req, res) => {
        res.send(await Database.getProducts());
    });

    // Create a product
    app.post(
        "/products",
        {
            schema: {
                body: createProductRequestSchema,
            },
        },
        async (req: FastifyRequest<{ Body: ProductRequest }>, res: FastifyReply) => {
            const product = req.body;
            const createdProduct = await Database.createProduct(product);
            res.code(201).send(createdProduct);
        }
    );

    // Get a product details
    app.get(
        "/products/:id",
        async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
            const productId = req.params.id;
            const product = await Database.getProductById(productId);
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            }
            res.send(product);
        }
    );

    // Get an order details
    app.get(
        "/products/orders/:id",
        async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
            const orderId = req.params.id;
            const order = await Database.getOrder(orderId);
            if (!order) {
                return res.status(404).send({ error: "Order not found" });
            }
            res.send(order);
        }
    );

    // Delete a product and any associated orders
    app.delete(
        "/products/:id",
        async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
            const productId = req.params.id;
            const deleted = await Database.deleteProductAndOrder(productId);
            if (deleted) {
                res.send({ message: "Product and associated order deleted successfully" });
            } else {
                res.status(404).send({ error: "Product not found" });
            }
        }
    );

    // Create an order
    app.post(
        "/products/:id/purchase",
        {
            schema: {
                body: createOrderRequestSchema,
            },
        },
        async (
            req: FastifyRequest<{ Params: { id: string }; Body: OrderRequest }>,
            res: FastifyReply
        ) => {
            const productId = req.params.id;
            const formData = req.body;
            const order = await Database.createOrderForProduct(productId, formData);

            if (!order) {
                return res.status(400).send({ error: "Failed to purchase the product" });
            }
            res.send({ message: "Product purchased successfully", order });
        }
    );

    // Get all users
    app.get("/users", async (req, res) => {
        res.send(await Database.getUsers());
    });

    // Create a user
    app.post(
        "/users",
        {
            schema: {
                body: createUserRequestSchema,
            },
        },
        async (req: FastifyRequest<{ Body: UserRequest }>, res: FastifyReply) => {
            const user = req.body;
            const createdUser = await Database.createUser(user);
            res.send(createdUser);
        }
    );

    // Login
    app.post(
        "/login",
        async (
            req: FastifyRequest<{ Body: { email: string; password: string } }>,
            res: FastifyReply
        ) => {
            const { email, password } = req.body;

            const user = await Database.getUserByEmail(email);
            if (!user || !(await Database.compareUserPassword(password, user.password))) {
                res.status(401).send({ error: "Invalid credentials" });
                return;
            }
            const userSanitized = Database.sanitizeUser(user);

            res.send({ message: "Login successful", user: userSanitized });
        }
    );

    app.setErrorHandler((error, req, res) => {
        console.error(error);

        if (error.validation) {
            res.status(400).send({ error: "Validation error", details: error.validation });
        } else {
            res.status(500).send({ error: "An unexpected error occurred" });
        }
    });

    return app;
}

if (require.main === module) {
    const port = 3000;
    const app = createServer();

    app.listen({ port }, () => {
        console.log(`Listening on port ${port}`);
    });
}
