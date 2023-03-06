import React from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Loading } from "../loading";
import {
  createProduct,
  fetchProductData,
  selectLoadingState,
  selectSortedProducts,
  sort,
} from "./productsSlice";
import {
  Options,
  ProductGrid,
  ProductGridItem,
  ProductsHeader,
  ProductsHeaderOptions,
} from "./styles";
import { SelectOption } from "./types";

const Products: React.FC = () => {
  const sortOptions: SelectOption[] = [
    { sortBy: null, sortOrder: null, label: "Filter.." },
    {
      sortBy: "price",
      sortOrder: "asc",
      label: "Sort by price (lowest to highest)",
    },
    {
      sortBy: "price",
      sortOrder: "desc",
      label: "Sort by price (highest to lowest)",
    },
    {
      sortBy: "created_at",
      sortOrder: "asc",
      label: "Sort by creation date (newest to oldest)",
    },
    {
      sortBy: "created_at",
      sortOrder: "desc",
      label: "Sort by creation date (oldest to newest)",
    },
  ];

  const [selectedOption, setSelectedOption] = React.useState<number>(0);
  const [limit, setLimit] = React.useState<number | null>(null);

  const { products } = useAppSelector(selectSortedProducts);
  const loading = useAppSelector(selectLoadingState);

  const dispatch = useAppDispatch();

  const handleCreateClick = () => {
    dispatch(createProduct());
  };

  const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedOption(Number(e.currentTarget.value));
    const vals = sortOptions[Number(e.currentTarget.value)];
    dispatch(sort({ sortBy: vals.sortBy, sortOrder: vals.sortOrder }));
  };

  const handleLimit = (e: React.FormEvent<HTMLSelectElement>) => {
    setLimit(
      !Number.isNaN(e.currentTarget.value)
        ? Number(e.currentTarget.value)
        : null
    );
  };

  React.useEffect(() => {
    dispatch(fetchProductData());
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ProductsHeader>
            <h2>Total products: {products.length}</h2>
            <h4>
              Products visible:{" "}
              {Number.isNaN(limit) || limit === null ? products.length : limit}
            </h4>
          </ProductsHeader>
          <ProductsHeaderOptions>
            <Options>
              <span>Filter products</span>
              <select onChange={(e) => handleChange(e)} value={selectedOption}>
                {sortOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option.label}
                  </option>
                ))}
              </select>

              <span>Number of products to show</span>
              <select
                onChange={(e) => handleLimit(e)}
                value={limit || undefined}
              >
                <option value={undefined}>All</option>
                {products.map((p, index) => {
                  if (index > 5 && index % 5 === 0) {
                    return (
                      <option key={index} value={index}>
                        {index}
                      </option>
                    );
                  }
                })}
              </select>
            </Options>

            <button onClick={() => handleCreateClick()}>
              Add a new product
            </button>
          </ProductsHeaderOptions>
          <ProductGrid>
            {products
              .slice(0, limit ? limit : products.length)
              .map((product) => (
                <ProductGridItem key={product._id}>
                  <div>
                    <p>{product.title}</p>
                    <p>${product.price}</p>
                    <Link to={`${product._id}`}>See details</Link>
                  </div>
                </ProductGridItem>
              ))}
          </ProductGrid>
        </>
      )}
    </div>
  );
};

export { Products };
