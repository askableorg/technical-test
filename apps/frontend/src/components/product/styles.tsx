import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const ProductItem = styled.div`
  padding: 1.5rem;
  border: 1px solid #dedede;
  margin: 0.5rem;

  * {
    margin: 0.25rem 0;
  }
`;

const OrderHistory = styled.div`
  color: #ccc;
`;

const Error = styled.p`
  color: crimson;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const PurchaseButton = styled.button`
  background-color: #eeffef;
  padding: 0.25rem 0.5rem;
  outline: none;
  border: 2px solid darkgrey;
  transition: all 0.15s;
  cursor: pointer;
  font-size: 1rem;

  &:not(:disabled):hover,
  &:not(:disabled):focus {
    border: 2px solid black;
  }
`;

const BackLink = styled(Link)`
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
`;

const DeleteButton = styled.button`
  background-color: crimson;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  color: #fff;
  border: 2px solid transparent;
  transition: all 0.15s;
  cursor: pointer;

  &:not(:disabled):hover,
  &:not(:disabled):focus {
    border: 2px solid black;
  }
`;

export {
  ProductItem,
  OrderHistory,
  Error,
  ButtonsWrapper,
  PurchaseButton,
  DeleteButton,
  BackLink,
};