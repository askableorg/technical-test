import { useEffect, useState } from 'react';
import { useProductsQuery } from '@/api/useProductsQuery';
import { getErrorMessage } from '@/utils';
import ProductItem from '@/components/ProductItem';
import ProductSort from '@/components/ProductSort';
import type { Product } from '@/pages/products/ProductPage';
import type { SortParams } from '@/components/ProductSort';

const API_URL = import.meta.env.VITE_API_URL;

const ProductsPage = () => {
  const [sortParams, setSortParams] = useState<SortParams | null>(null);

  const { fetchProducts } = useProductsQuery();
  const { data: products, isLoading, isError, error, refetch } = fetchProducts(sortParams ?? {});

  useEffect(() => {
    refetch();
  }, [sortParams]);

  return (
    <>
      <header className="inline-between inline-wrap sticky">
        <h1>All Products</h1>
        <ProductSort onChange={setSortParams} />
      </header>

      <main className="stack">
        {isError ? <div className="callout critical">{getErrorMessage(error)}</div> : null}
        {isLoading ? <div className="callout text-centered">Loading...</div> : null}
        {products && products.length > 0 ? (
          <ul className="grid-blocks-4">
            {products.map((product: Product) => (
              <ProductItem product={product} key={product._id} />
            ))}
          </ul>
        ) : (
          <div className="text-centered">No products found</div>
        )}
      </main>
    </>
  );
};

export default ProductsPage;
