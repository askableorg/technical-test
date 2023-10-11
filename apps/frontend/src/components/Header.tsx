import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// @todo React Router should handle dynamic page titles, right? It's simple in Vue Router
const defaultTitle = 'Ye Olde Shoppe | Askable technical test';
const pageTitles: { [key: string]: string } = {
  '/': 'Home',
  '/products': 'Products',
  '/product': 'Product',
  '/users': 'Users',
  '/admin/products': 'Manage Products',
  '/admin/products/add': 'Add Product',
  '/admin/orders': 'Manage Orders'
};

const Header = () => {
  const location = useLocation();
  useEffect(() => {
    const title = pageTitles[location.pathname];
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;
  }, [location]);

  return (
    <header id="header" className="sticky inline-between inline-wrap">
      <h2>
        <NavLink to="/">Ye Olde Shoppe</NavLink>
      </h2>
      <nav>
        <ul className="inline-zero" role="list">
          <li>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/admin/products">Manage Products</NavLink>
            <NavLink to="/admin/orders">Manage Orders</NavLink>
            <NavLink to="/users">Users</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
export { defaultTitle };
