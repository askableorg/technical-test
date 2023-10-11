import { Link } from 'react-router-dom';
import { useOrdersQuery } from '@/api/useOrdersQuery';
import dayjs from 'dayjs';
import { getErrorMessage, formatPrice } from '@/utils';
import type { Product } from '@/pages/products/ProductPage';

export type Order = {
  _id: string;
  created_at: string;
  product_id: string;
  product?: Product;
};

const AdminOrders = () => {
  const { fetchOrders } = useOrdersQuery();
  const { data: orders, isLoading, isError, error, refetch } = fetchOrders();

  return (
    <>
      <header className="stack-zero sticky">
        <h1>Manage Orders</h1>
      </header>
      <main className="stack">
        {isError ? <div className="callout critical">{getErrorMessage(error)}</div> : null}
        {isLoading ? <div className="callout">Loading...</div> : null}
        {orders && orders.length > 0 ? (
          <div className="scroll-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Order) => (
                  <tr key={`order-${order._id}`}>
                    <td>{order._id}</td>
                    <td>
                      <Link to={`/product/${order.product_id}`}>{order.product ? order.product.title : 'View'}</Link>
                    </td>
                    <td>{order.product ? formatPrice(order.product.price) : '-'}</td>
                    <td>{dayjs(order.created_at).format('DD MMM YYYY, h:mma')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="callout">No orders yet</div>
        )}
      </main>
    </>
  );
};

export default AdminOrders;
