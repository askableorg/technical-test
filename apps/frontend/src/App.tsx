import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import ProductsPage from '@/pages/products/ProductsPage';
import ProductPage from '@/pages/products/ProductPage';
import RootPage from '@/pages/root/RootPage';
import UsersPage from '@/pages/users/UsersPage';
import Error404 from '@/pages/404';
import Header from '@/components/Header';

import AdminProducts from '@/pages/admin/AdminProducts';
import AdminAddProduct from '@/pages/admin/AdminAddProduct';
import AdminOrders from '@/pages/admin/AdminOrders';

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/',
        element: <RootPage />
      },
      {
        path: '/users',
        element: <UsersPage />
      },
      {
        path: '/products',
        element: <ProductsPage />
      },
      {
        path: '/product/:id',
        element: <ProductPage />
      },
      {
        path: 'admin/products',
        element: <AdminProducts />
      },
      {
        path: 'admin/products/add',
        element: <AdminAddProduct />
      },
      {
        path: 'admin/orders',
        element: <AdminOrders />
      },
      {
        path: '*',
        element: <Error404 />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
