import { ChangeEvent, useEffect, useState } from "react";
import { Product } from '../../server/data/generator';
import { Box, Button, Center, Flex, FormControl, FormLabel, Select, SimpleGrid } from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import { API } from "./api";
import { useNavigate } from "react-router-dom";

function ProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = JSON.parse(window.localStorage.getItem('sort')) ? 
    useState<string>(JSON.parse(window.localStorage.getItem('sort'))) : 
    useState<string>('dateCreated');
  const [sortOrder, setSortOrder] = JSON.parse(window.localStorage.getItem('sortOrder')) ? 
    useState<string>(JSON.parse(window.localStorage.getItem('sortOrder'))) : 
    useState<string>('sortOrder');

  useEffect(() => {
    getProducts();
  },[]);

  useEffect(() => {
    window.localStorage.setItem('sort', JSON.stringify(sort));
  }, [sort]);

  useEffect(() => {
    window.localStorage.setItem('sortOrder', JSON.stringify(sortOrder));
  }, [sortOrder]);

  async function getProducts(): Promise<void> {
    await fetch(`${API.baseUrl}/products`)
    .then(async (response) => response.json())
    .then(products => {
      if (products.length > 0) {
        setProducts(products);
        sortBy(products, sort, sortOrder);
      }
    });
  }

  function sortBy(products: Product[], sortBy: string, order: string) {
    if (sortBy === 'price') {
      let _products: Product[] = products.sort(comparePrice);
      if (order === 'desc') {
        _products.reverse();
      }
      setProducts(_products);
    }
    if (sortBy === 'dateCreated') {
      const _products = products.sort(compareDate);
      if (order === 'desc') {
        products.reverse();
      }
      setProducts(_products);
    }
  }

  function comparePrice(a: Product, b: Product) {
    const price1 = Number(a.price);
    const price2 = Number(b.price);

    let comparison = 0;

    if (price1 > price2) {
        comparison = 1;
    } else if (price1 < price2) {
        comparison = -1;
    }
    return comparison;
  }

  function compareDate(a: Product, b: Product) {
    const date1 = new Date(a.created_at);
    const date2 = new Date(b.created_at);
    return date2.valueOf() - date1.valueOf();
  }

  function handleSortChange(event: ChangeEvent<HTMLInputElement>){
    const sort = event.target.value
    setSort(sort)
    sortBy(products, sort, sortOrder)
  };

  function handleOrderChange(event: ChangeEvent<HTMLInputElement>) {
    const sortOrder = event.target.value
    setSortOrder(sortOrder);
    sortBy(products, sort, sortOrder)
  };

  function createNewProduct() {
    navigate(`/newProduct`);
  }
 
  return (
    <Center>
      <Box>
        <Box>
        <Flex>
          <Flex mr={5} alignItems="flex-end">
          Viewing {products.length} items
          </Flex>
          <Flex>
          <FormControl>
          <FormLabel>Sort by:</FormLabel>
            <Select w={40} value={sort} onChange={handleSortChange}>
              <option value="dateCreated">Date Created</option>
              <option value="price">Price</option>
            </Select>
          </FormControl>
          </Flex>
          <Flex ml={5}>
          <FormControl>
          <FormLabel>Order:</FormLabel>
            <Select w={40} onChange={handleOrderChange} value={sortOrder}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </FormControl>
          </Flex>
          <Flex ml={5} alignItems="flex-end">
            <Button onClick={()=> {createNewProduct()}} colorScheme='blue' variant='solid'>
              Create New Product
            </Button>
          </Flex>
        </Flex>
        </Box>
        <SimpleGrid mt={5} columns={4} spacing={8}>
          {products && products.map((product: Product) => 
            <Box key={product._id} height='300px'>
              <ProductCard {...product}/>
            </Box>
          )}
        </SimpleGrid>
      </Box>
    </Center>
  );
}

export default ProductsList;
