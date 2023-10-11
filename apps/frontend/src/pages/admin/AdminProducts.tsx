import { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useProductsQuery } from '@/api/useProductsQuery';
import { getErrorMessage, formatPrice } from '@/utils';
import ProductSort from '@/components/ProductSort';
import type { Product } from '@/pages/products/ProductPage';
import type { SortParams } from '@/components/ProductSort';

const AdminProducts = () => {
  const [isDeleted, setIsDeleted] = useState<string | null>(null);
  const [sortParams, setSortParams] = useState<SortParams | null>(null);

  const { fetchProducts, deleteProduct } = useProductsQuery();
  const { data: products, isLoading, isError, error, refetch } = fetchProducts(sortParams ?? {});
  const { mutate, isError: isErrorDeleting, error: errorDeleting } = deleteProduct();

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Delete this product?')) {
      await mutate(id);

      // Show a success message for 3 seconds @todo change to a toast
      setIsDeleted(`Product deleted: ${id}`);
      window.setTimeout(() => setIsDeleted(null), 3000);
    }
  };

  return (
    <>
      <header className="stack-stack sticky">
        <div className="inline-between inline-wrap">
          <h1>Manage Products</h1>

          <Link to="/admin/products/add" className="button">
            Add Product
          </Link>
        </div>

        <ProductSort onChange={setSortParams} />
      </header>

      {isDeleted ? <div className="callout positive">{isDeleted}</div> : null}
      <main className="stack">
        {isErrorDeleting ? <div className="callout critical">{getErrorMessage(errorDeleting)}</div> : null}
        {isError ? <div className="callout critical">{getErrorMessage(error)}</div> : null}
        {isLoading ? <div className="callout text-centered">Loading...</div> : null}
        {products && products.length > 0 ? (
          <div className="scroll-container">
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Order ID</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: Product) => (
                  <tr key={`product-${product._id}`}>
                    <td>{product._id}</td>
                    <td>
                      <Link to={`/product/${product._id}`}>{product.title}</Link>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.order_id}</td>
                    <td>{dayjs(product.created_at).format('DD MMM YYYY, h:mma')}</td>
                    <td className="inline">
                      <button onClick={() => handleDeleteProduct(product._id)} className="button icon critical">
                        <svg className="icon-tabler" height="20" width="20" viewBox="0 0 24 24">
                          <title>Delete</title>
                          <path d="M4 7l16 0"></path>
                          <path d="M10 11l0 6"></path>
                          <path d="M14 11l0 6"></path>
                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !isLoading ? (
          <div className="callout">No products found</div>
        ) : null}
      </main>
    </>
  );
};

export default AdminProducts;
