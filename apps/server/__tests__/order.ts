import { Database } from '../data/Database';
import app from '../index';

/**
 * Run `pnpm test` to test the /orders API endpoints
 */

describe('GET /orders', () => {
  test('Should get an 200 OK', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/orders'
    });
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /order', () => {
  const mockOrder = {
    _id: 'order_id',
    product_id: 'product_id',
    created_at: '2023-10-10'
  };

  const options = {
    method: 'POST',
    url: '/order',
    headers: { 'Content-Type': 'application/json' }
  };

  it('should create an order', async () => {
    Database.createOrder = jest.fn().mockResolvedValue(mockOrder);

    const response = await app.inject({
      ...options,
      payload: JSON.stringify({ id: 'product_id' })
    } as any);

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toEqual(mockOrder);
  });

  it('should handle missing product ID', async () => {
    const response = await app.inject({
      ...options,
      payload: JSON.stringify({ id: '' })
    } as any);

    expect(response.statusCode).toBe(400);
    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toEqual({ message: 'Missing product ID' });
  });

  it('should handle database errors', async () => {
    Database.createOrder = jest.fn().mockRejectedValue(new Error('Database error message'));

    const response = await app.inject({
      ...options,
      payload: JSON.stringify({ id: 'product-id' })
    } as any);

    expect(response.statusCode).toBe(400);
  });
});
