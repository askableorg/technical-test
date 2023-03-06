import appSetup from './app';

describe('test routes', () => {
  it('test', async () => {
    const app = appSetup();

    const res = await app.inject({
      method: 'GET',
      url: '/test',
    });

    expect(res.statusCode).toEqual(200);
  });

  it('get products', async () => {
    const app = appSetup();

    const res = await app.inject({
      method: 'GET',
      url: '/products',
    });

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.body)).toHaveLength(50);
  });

  it('delete product', async () => {
    const app = appSetup();

    const productsRes = await app.inject({
      method: 'GET',
      url: '/products',
    });

    const products = JSON.parse(productsRes.body);
    expect(products).toHaveLength(50);

    const res = await app.inject({
      method: 'POST',
      url: '/products/delete',
      payload: {
        id: products[1]._id,
      }
    });

    expect(res.statusCode).toEqual(200);

    const products2 = await app.inject({
      method: 'GET',
      url: '/products',
    });

    expect(JSON.parse(products2.body)).toHaveLength(49);
  });
});