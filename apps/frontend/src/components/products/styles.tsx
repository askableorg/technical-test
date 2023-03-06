import styled from "@emotion/styled";

const ProductsHeader = styled.div`
  display: flex;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;

  h2,
  h4 {
    margin: 0;
  }

  margin-bottom: 1rem;
`;

const ProductsHeaderOptions = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;

  button {
    background-color: #eeffef;
    padding: 0.25rem 0.5rem;
    outline: none;
    border: 2px solid darkgray;
    transition: all 0.15s;
    cursor: pointer;
    font-size: 1rem;

    &:not(:disabled):hover,
    &:not(:disabled):focus {
      border: 2px solid black;
    }
  }
`;

const Options = styled.div`
  display: flex;
  gap: 0.5rem;

  select {
    border: 2px solid darkgray;
    background: #eeffef;
    padding: 0.25rem 0.5rem;
    transition: all 0.15s;
    cursor: pointer;
  }

  select:hover,
  select:focus {
    border: 2px solid black;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-gap: 0.25rem;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
`;

const ProductGridItem = styled.div`
  box-sizing: border-box;

  > div {
    border: 1px solid #dedede;
    padding: 1.5rem;
  }
`;

export {
  ProductsHeader,
  ProductsHeaderOptions,
  Options,
  ProductGrid,
  ProductGridItem,
};
