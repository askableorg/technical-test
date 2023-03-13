

import { useState } from "react";
import { Box, Center, Input, Button, Spacer, useToast, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { API } from "./api";
import BackButton from "./BackButton";

function NewProduct() {
    const navigate = useNavigate();
    const toast = useToast();

    const [product, setProduct] = useState({
        title: "",
        category: "",
        price: ""
    });

    const [isSubmitted, setIsSubmitted] = useState<Boolean>(false);

    function showErrorToast(message:string) {
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }

    async function createNewProduct() {
        setIsSubmitted(true);
        if (!product.title) {
            showErrorToast('Please provide the title');
        }
        if (!product.category) {
            showErrorToast('Please provide the category');
        }
        if (!product.price) {
            showErrorToast('Please provide the price');
        }
        if (isNaN(product.price)) {
            showErrorToast('Price is not a valid number');
        }

        if (product.title && product.category && product.price && !isNaN(product.price)) {
            await fetch(`${API.baseUrl}/products`, {
                method: 'POST',
                body: JSON.stringify({
                  title: product.title,
                  category: product.category,
                  price: product.price
                }),
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
            }).then(
            async (response)=> {
                if (!response.ok) {
                    const data = await response.json();
                    showErrorToast(data.message);
                } else {
                    toast({
                        title: 'Success!',
                        description: `Product "${product.title}" was created!`,
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    });
                    navigate(`/products`);
                }  
            })
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setProduct({
            ...product,
            [event.target.name]: value
        });
    }

    return (
        <Box>
            <BackButton/>
            <Center>
                <Box w={500} mt={10} p="10" maxW="600px" borderWidth="1px" height="400px">
                    <FormControl>
                        <Box>
                            <FormLabel>Title:</FormLabel>
                            <Input
                                placeholder='Title'
                                name="title"
                                value={product.title}
                                onChange={handleChange}
                                maxLength={25}
                                isInvalid={isSubmitted && product.title.length === 0}
                                errorBorderColor='red.300'/>
                        </Box>
                        <Box mt={5}>
                            <FormLabel>Category:</FormLabel>
                            <Select placeholder='Category' name="category" onChange={handleChange}>
                                <option value="Sneakers">Sneakers</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Watches">Watches</option>
                                <option value="Hats">Hats</option>
                            </Select>
                        </Box>
                        <Box mt={5}>
                            <FormLabel>Price:</FormLabel>
                            <Input
                                placeholder='Price'
                                name="price"
                                maxLength={10}
                                value={product.price}
                                onChange={handleChange}
                                isInvalid={isSubmitted && (product.price.length === 0 || isNaN(product.price))}
                                errorBorderColor='red.300'
                            />
                        </Box>
                    </FormControl>
                    <Spacer />
                    <Box mt={10}>
                        <Button onClick={()=> createNewProduct()} colorScheme='blue' variant='solid'>
                            Create
                        </Button>
                    </Box>
                </Box>
            </Center>
        </Box>
    );
}

export default NewProduct;

