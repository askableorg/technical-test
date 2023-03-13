import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    isRouteErrorResponse,
    RouterProvider,
    useRouteError,
  } from "react-router-dom";
import ProductsList from './ProductsList'
import './index.css'
import ProductView from './ProductView';
import { ChakraProvider } from "@chakra-ui/react";
import NewProduct from './NewProduct';

function RootBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return <div>This page doesn't exist!</div>
      }
    }
    return <div>Something went wrong</div>;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProductsList/>,
        errorElement: <RootBoundary />
    },
    {
      path: "/products",
      element: <ProductsList/>,
    },
    {
        path: "/products/:productId",
        element: <ProductView/>,
    },
    {
        path: "/newProduct",
        element: <NewProduct/>,
    },
  ]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ChakraProvider>
        <RouterProvider router={router} />
    </ChakraProvider>
)
