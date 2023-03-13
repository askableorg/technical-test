import tap from 'tap'
import { Order, Product } from '../data/generator';
import fetch from 'node-fetch';

const baseUrl = 'http://localhost:3000';
const headers = 'application/json; charset=utf-8';

tap.test('GET `/` route', async t => {
  //Verify that the products array is not empty
  const response = await fetch(
    `${baseUrl}/products`
  )
  t.equal(response.status, 200)
  t.equal(
    response.headers.get('content-type'),
    headers
  )
  const products = await response.json();
  t.equal(products.length > 0, true)
})

tap.test('GET `/products/:productId` route', async t => {
  //Verify that the view product api works
  //Steps: Grab sample product froom list of produts and verify the api that fetch details work with that id
  let productSample: Product;
  const productsResponse = await fetch(
    `${baseUrl}/products`
  )
  t.equal(productsResponse.status, 200)
  t.equal(
    productsResponse.headers.get('content-type'),
    headers
  )
  const products = await productsResponse.json();
  productSample = products[0];

  const productDetailResponse = await fetch(
    `${baseUrl}/products/${productSample._id}`
  )
  t.equal(productDetailResponse.status, 200)
  t.equal(
    productDetailResponse.headers.get('content-type'),
    headers
  )
  const product = await productDetailResponse.json();
  t.equal(product._id, productSample._id)
})

tap.test('POST `/products` route', async t => {
  //Verify that the creation of a new product works
  const newProduct = {
    title: 'New product',
    category: 'Hats',
    price: '120.50'
  };

  const createNewProductResponse = await fetch(
      `${baseUrl}/products`, {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
  });
  t.equal(createNewProductResponse.status, 200)
  t.equal(
    createNewProductResponse.headers.get('content-type'),
    headers
  )
  const productCreated = await createNewProductResponse.json();
  t.equal(productCreated.title, newProduct.title)
})

tap.test('PUT `/products/:productId` route', async t => {
  //Verify that the purchase of a product works
  //Steps: Create new product from scratch, purchase it and verify that the ids of products and order match
  const newProduct = {
    title: 'New product',
    category: 'Hats',
    price: '120.50'
  }
  const createNewProductResponse = await fetch(
      `${baseUrl}/products`, {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
  });
  t.equal(createNewProductResponse.status, 200)
  t.equal(
    createNewProductResponse.headers.get('content-type'),
    headers
  )
  const productCreated: Product = await createNewProductResponse.json();

  const purchaseNewProductResponse = await fetch(
      `${baseUrl}/products/${productCreated._id}`, {
      method: 'PUT',
  });
  t.equal(purchaseNewProductResponse.status, 200)
  t.equal(
    purchaseNewProductResponse.headers.get('content-type'),
    headers
  )
  const purchaseOrder: Order = await purchaseNewProductResponse.json();
  t.equal(productCreated._id, purchaseOrder.product_id);
})


tap.test('DELETE `/products/:productId` route', async t => {
  //Verify that the DELETE product works, and if there is an order associated with it, it also gets deleted
  //Steps: Create new product, purchase it, and then delete it to verify both product and order were deleted
  const newProduct = {
    title: 'Product to delete',
    category: 'Clothes',
    price: '99.99'
  }
  const createNewProductResponse = await fetch(
      `${baseUrl}/products`, {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
  });
  t.equal(createNewProductResponse.status, 200)
  t.equal(
    createNewProductResponse.headers.get('content-type'),
    headers
  )
  const productCreated: Product = await createNewProductResponse.json();

  const purchaseNewProductResponse = await fetch(
      `${baseUrl}/products/${productCreated._id}`, {
      method: 'PUT',
  });
  t.equal(purchaseNewProductResponse.status, 200)
  t.equal(
    purchaseNewProductResponse.headers.get('content-type'),
    headers
  )
  const purchaseOrder: Order = await purchaseNewProductResponse.json();
  t.equal(productCreated._id, purchaseOrder.product_id);

  //Delete product and verify both product and order were deleted
  const deleteProductResponse = await fetch(
      `${baseUrl}/products/${productCreated._id}`, {
      method: 'DELETE',
  });
  t.equal(deleteProductResponse.status, 200)
  t.equal(
    deleteProductResponse.headers.get('content-type'),
    headers
  )

  const productsResponse = await fetch(
    `${baseUrl}/products`
  )
  t.equal(productsResponse.status, 200)
  t.equal(
    productsResponse.headers.get('content-type'),
    headers
  )
  const products: Product[] = await productsResponse.json();
  
  const productStillExists = products.find(product => product._id === productCreated._id);
  t.equal(!!productStillExists, false);

  const ordersResponse = await fetch(
    `${baseUrl}/orders`
  )
  t.equal(ordersResponse.status, 200)
  t.equal(
    ordersResponse.headers.get('content-type'),
    headers
  )
  const orders: Order[] = await ordersResponse.json();
  
  const orderStillExists = orders.find(order => order._id === purchaseOrder._id);
  t.equal(!!orderStillExists, false);
})

tap.test('Double purchase error', async t => {
  //Verify that if we attempt to buy the same product twice the API will throw an error
  const newProduct = {
    title: 'New product',
    category: 'Hats',
    price: '120.50'
  }
  const createNewProductResponse = await fetch(
      `${baseUrl}/products`, {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
  });
  t.equal(createNewProductResponse.status, 200)
  t.equal(
    createNewProductResponse.headers.get('content-type'),
    headers
  )
  const productCreated: Product = await createNewProductResponse.json();

  const purchaseNewProductResponse = await fetch(
      `${baseUrl}/products/${productCreated._id}`, {
      method: 'PUT',
  });
  t.equal(purchaseNewProductResponse.status, 200)

  const purchaseNewProductSecondTimeResponse = await fetch(
    `${baseUrl}/products/${productCreated._id}`, {
    method: 'PUT',
  });
  t.equal(purchaseNewProductSecondTimeResponse.status, 500);
  const data = await purchaseNewProductSecondTimeResponse.json();
  t.equal(data.message.length > 0, true);
})