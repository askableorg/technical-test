import { useParams, Link } from 'react-router-dom';
import { useProductsQuery } from '@/api/useProductsQuery';
import { getErrorMessage, formatPrice } from '@/utils';
import BuyButton from '@/components/BuyButton';

const API_URL = import.meta.env.VITE_API_URL;

type Maybe<T> = T | null;

type Categories = 'Sneakers' | 'Clothing' | 'Watches' | 'Hats';

type WithId<T> = T & {
  _id: string;
};

export type Product = WithId<{
  title: string;
  order_id: Maybe<string>;
  category: Categories;
  created_at: string;
  price: string;
}>;

const ProductPage = () => {
  const { id } = useParams();
  const { fetchProductById } = useProductsQuery();
  const { data: product, isLoading, isError, error } = fetchProductById(id);

  return (
    <div className="content-narrow centered">
      {isError ? <div className="callout critical">{getErrorMessage(error)}</div> : null}
      {isLoading ? <div className="callout">Loading...</div> : null}
      {product ? (
        <>
          <header className="stack-quarter sticky" data-cy={product._id}>
            <div className="inline">
              <Link to="/products" className="button-back text-small">
                &larr; Back
              </Link>
              <div className="tag">{product.category}</div>
            </div>
            <h1>{product ? product.title : 'Product'}</h1>
          </header>

          <main className="stack">
            <div className="price">{formatPrice(product.price)}</div>
            <BuyButton productId={product._id} orderId={product.order_id ?? null} />
          </main>
        </>
      ) : null}
    </div>
  );
};

export default ProductPage;
