import { useEffect, useState } from "react";
import { Order, Product, Maybe } from '../../server/data/generator';
import { useParams, useNavigate } from 'react-router-dom';
import { Spacer, Box, Button, Image, Flex, Badge, Text, Center, Popover, PopoverArrow, 
  PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, 
  PopoverHeader, PopoverTrigger, Portal, useToast } from "@chakra-ui/react";
import { API } from "./api";
import BackButton from "./BackButton";

function ProductView() {
  const [product, setProduct] = useState<Product | null>(null);
  const [orderId, setOrderId] = useState<Maybe<String> | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  let { productId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);

  function showErrorToast(message:string) {
    toast({
      title: 'Error',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }

  function showSuccessToast(message:string) {
    toast({
      title: 'Success!',
      description: message,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  }

  async function getProductById(productId: string) {
    await fetch(`${API.baseUrl}/products/${productId}`).then(
      async (response)=> {
        if (!response.ok) {
          const data: any = await response.json();
          showErrorToast(data.message)
          navigate(`/products`);
        }
        const product: Product = await response.json();  
        setProduct(product);
        if (product.order_id) {
          setOrderId(product.order_id)
        }
    })
  } 
  async function purchaseProduct() {
    await fetch(`${API.baseUrl}/products/${product?._id}`, {
      method: 'PUT',
    }).then(
      async (response)=> {
        const data = await response.json();
        if (!response.ok) {
          showErrorToast(data.message);
        } else {
          showSuccessToast(`You have bought: ${product.title}`);
          navigate(`/products`);
        }  
    })
  }
  async function deleteProduct() {
    await fetch(`${API.baseUrl}/products/${product?._id}`, {
      method: 'DELETE',
    }).then(
      async (response)=> {
        const data = await response.json();
        if (!response.ok) {
          showErrorToast(data.message);
        } else {
          showSuccessToast(`You have deleted product: ${product.title}`);
        }
        navigate(`/products`);
    })
  }
  async function getOrderDetails() {
    await fetch(`${API.baseUrl}/orders/${product?.order_id}`).then(
      async (response)=> {
        if (!response.ok) {
          const data = await response.json();
          showErrorToast(data.message);
        } else {
          const order = await response.json();
          setOrderDetails(order);
        }
    })
  }

  return (
      product ? 
      <Box>
        <BackButton/>
        <Center>
          <Box mt={5} p="5" maxW="450px" borderWidth="1px" height={product.order_id ? '500px': '480px'} >
          <Image borderRadius="md" src="http://via.placeholder.com/640x360" />
          <Flex align="baseline" mt={4}>
            {!product.order_id && <Badge colorScheme="green">Available</Badge>}
          </Flex>
          <Flex align="baseline" mt={2}>
            <Text
                textTransform="uppercase"
                fontSize="sm"
                fontWeight="bold"
                color="black.800">
                {product.title}
            </Text>
          </Flex>
          <Flex align="baseline" mt={2}>
            <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
              Category: {product.category}
            </Text>
          </Flex>
          <Flex mt={2}>
            <Text mt={2}>${product.price}</Text>
          </Flex>
          {orderDetails && 
          <Box>
            <Flex align="baseline" mt={2}>
              <Text mt={2} fontSize="md" lineHeight="short">
              Order ID: {orderDetails._id}
              </Text>
            </Flex>
          </Box>}
          <Flex mt={5}>
            <Button onClick={()=> purchaseProduct()} colorScheme='teal' variant='solid'>
              Buy
            </Button>
            <Spacer />
            <Popover>
            <PopoverTrigger>
              <Button colorScheme='red' variant='solid'>
                Delete
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader border={'none'}><b>Warning!</b></PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                Are you sure you would like to delete this product?
                </PopoverBody>
                <PopoverFooter><Button colorScheme='red' onClick={()=> deleteProduct()}>Confirm</Button></PopoverFooter>
              </PopoverContent>
            </Portal>
            </Popover>
          </Flex>
        </Box>
      </Center>
    </Box> : null
    );
}

export default ProductView;

