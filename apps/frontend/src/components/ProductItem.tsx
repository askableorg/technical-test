import { Link } from 'react-router-dom';
import BuyButton from '@/components/BuyButton';
import { formatPrice } from '@/utils';
import type { Product } from '@/pages/products/ProductPage';

/**
 * Product Item
 * Show single product as a list item
 */

const ProductItem = ({ product }: { product: Product }) => {
  const { _id, title, price, order_id } = product;

  return (
    <li
      className={['product-item', 'stack-half', 'text-centered', order_id ? 'sold' : undefined].join(' ')}
      data-cy={_id}>
      <div className="tag">{product.category}</div>
      <h3>
        <Link to={`/product/${_id}`} title="View product">
          {title}
        </Link>
      </h3>
      <div className="price">{formatPrice(price)}</div>
      <BuyButton productId={_id} orderId={order_id ?? null} />
    </li>
  );
};

export default ProductItem;
