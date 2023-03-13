import {  Product } from '../../server/data/generator';
import { Box, Image, Flex, Badge, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function ProductCard(product: Product) {
    const navigate = useNavigate();

    function viewProduct() {
        navigate(`/products/${product._id}`);
    }

    return (
        <Box p="4" maxW="400px" borderWidth="1px" height="300px" 
            _hover={{ bg: "gray.30", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", cursor: 'pointer' }}
            onClick={()=> {viewProduct()}}>
            <Image borderRadius="md" src="http://via.placeholder.com/640x360" />
            <Flex align="baseline" mt={2}>
                {!product.order_id ? <Badge colorScheme="green">Available</Badge> : <Badge colorScheme="red">Sold</Badge>}
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
                <Text fontSize="xl" fontWeight="semibold" lineHeight="short">
                {product.category}
                </Text>
            </Flex>
            <Flex align="baseline" mt={2}>
                <Text mt={2}>${product.price}</Text>
            </Flex>
        </Box>
    );
}

export default ProductCard;

