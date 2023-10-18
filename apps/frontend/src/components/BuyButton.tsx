import { useOrdersQuery } from '@/api/useOrdersQuery';
import { getErrorMessage } from '@/utils';

/**
 * Buy Button
 * @action create a new order with the productId
 * If `orderId` is set, show a 'Purchased' callout instead
 */

type TBuyButton = {
  productId: string;
  orderId: string | null;
};

const BuyButton = ({ productId, orderId }: TBuyButton) => {
  const { addOrder } = useOrdersQuery();
  const { mutate, isLoading, isError, error } = addOrder();

  const buy = () => {
    mutate(productId);
  };

  return (
    <>
      {isError ? <div className="callout critical">{getErrorMessage(error)}</div> : null}
      {orderId ? (
        <div className="callout positive text-centered">Sold!</div>
      ) : (
        <button onClick={() => buy()} className="button" disabled={isLoading}>
          {isLoading ? 'Buying...' : 'Buy'}
        </button>
      )}
    </>
  );
};

export default BuyButton;
