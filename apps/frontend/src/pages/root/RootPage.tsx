import { Link } from 'react-router-dom';

/**
 * Unused page, can probably replace with /products
 */

const RootPage = () => (
  <div className="centered text-centered">
    <div className="stack">
      <h1>Welcome to Tech test 👋</h1>

      <div className="inline inline-wrap">
        <Link to="/products" className="button">
          Products
        </Link>
        <Link to="/admin/products" className="button">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="button">
          Manage Orders
        </Link>
        <Link to="/users" className="button">
          Users
        </Link>
      </div>
    </div>
  </div>
);

export default RootPage;
