import { Database } from "./Database";

describe("test database functions", () => {

  beforeEach(() => {
    Database.resetData();
  });

  it("get products", async () => {
    const products = await Database.getProducts();
    expect(products.length).toEqual(50);
  });

  it("get product by id", async () => {
    const [product] = await Database.getProducts();

    const getProduct = await Database.getProductById(product._id);

    expect(getProduct).toBeTruthy();
    expect(getProduct?._id).toEqual(product._id);
  });

  it("add product", async () => {
    const products = await Database.getProducts();
    expect(products.length).toEqual(50);

    await Database.addProduct();
    const products2 = await Database.getProducts();
    expect(products2.length).toEqual(51);
  });

  it("delete product", async () => {
    const products = await Database.getProducts();
    const orders = await Database.getOrders();
    expect(products.length).toEqual(50);
    expect(orders.length).toEqual(10);
    // Get a product with an order to test both parts
    const productToDelete = products.find((p) => p.order_id !== null);
    expect(productToDelete).toBeTruthy();
    await Database.deleteProductById(productToDelete!._id);

    const products2 = await Database.getProducts();
    const orders2 = await Database.getOrders();
    expect(products2.length).toEqual(49);
    expect(orders2.length).toEqual(9);
  });

  it("purchase product", async () => {
    const products = await Database.getProducts();
    const orders = await Database.getOrders();
    expect(orders.length).toEqual(10);
    // Get a product without an order
    const productToPurchase = products.find((p) => p.order_id === null);
    expect(productToPurchase).toBeTruthy();
    expect(productToPurchase!.order_id).toBeNull();
    await Database.addOrder(productToPurchase!._id);

    const product = await Database.getProductById(productToPurchase!._id);
    const orders2 = await Database.getOrders();
    expect(product.order_id).toBeDefined();
    expect(orders2.length).toEqual(11);
  });

  it("purchase product that is sold out", async () => {
    const products = await Database.getProducts();
    // Get a product WITH an order
    const productToPurchase = products.find((p) => p.order_id !== null);
    expect(productToPurchase!.order_id).not.toBeNull();

    await expect(
      Database.addOrder(productToPurchase!._id)
    ).rejects.toThrowError('Product is sold out');
  });
})