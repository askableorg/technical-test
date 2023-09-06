import fastify from "fastify";
import cors from "@fastify/cors";
import { Database } from "./data/Database";

const app = fastify();
const port = 3000;

app.register(cors, {});

app.get("/products", async (req, res) => {
  res.send(await Database.getProducts());
});

app.get("/users", async (req, res) => {
  res.send(await Database.getUsers());
});

app.listen({ port }, () => {
  console.log(`Listening on port ${port}`);
});
