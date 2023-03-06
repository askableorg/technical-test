import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { deleteProduct } from "../products/productsSlice";
import {
  BackLink,
  ButtonsWrapper,
  DeleteButton,
  OrderHistory,
  ProductItem,
  PurchaseButton,
  Error,
} from "./styles";
import {
  fetchProductData,
  selectLoading,
  selectProduct,
  purchaseProduct,
} from "./productSlice";
import { Loading } from "../loading";

const Product: React.FC = () => {
  const productId = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { product } = useAppSelector(selectProduct);
  const loading = useAppSelector(selectLoading);

  const handlePurchaseClick = () => {
    try {
      if (window.confirm("Are you sure you want to purchase this product?")) {
        dispatch(purchaseProduct(productId.id!));
      }
    } catch (e) {
      console.warn("error deleting", e);
    }
  };

  const handleDeleteClick = () => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        dispatch(deleteProduct(productId.id!));
        navigate("/");
      }
    } catch (e) {
      console.warn("error deleting", e);
    }
  };

  if (!product) {
    return (
      <div>
        <h4>Product not found</h4>
        <Link to={"/"}>Back to products</Link>
      </div>
    );
  }

  const { title, order_id, category, price } = product;

  React.useEffect(() => {
    dispatch(fetchProductData(productId.id!));
  }, []);

  return (
    <>
      <BackLink to={"/"}>Back to products</BackLink>
      {loading ? (
        <Loading />
      ) : (
        <ProductItem>
          <h3>{title}</h3>
          <p>Category: {category}</p>
          <p>Price: ${price}</p>
          {order_id && (
            <OrderHistory>
              <p>Order History:</p>
              <ul>
                <li>Order ID: {order_id}</li>
              </ul>

              <Error>Sold out</Error>
            </OrderHistory>
          )}
          <ButtonsWrapper>
            {!order_id && (
              <PurchaseButton onClick={() => handlePurchaseClick()}>
                Purchase
              </PurchaseButton>
            )}
            <DeleteButton onClick={() => handleDeleteClick()}>
              Delete Product
            </DeleteButton>
          </ButtonsWrapper>
        </ProductItem>
      )}
    </>
  );
};

export { Product };
