import { NavLink } from 'react-router-dom';

const Header = () => {
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
