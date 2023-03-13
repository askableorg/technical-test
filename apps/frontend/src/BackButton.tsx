import { Box, Center, IconButton } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from '@chakra-ui/icons'

function BackButton() {
    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return (
        <Center>
            <Box>
                <IconButton
                onClick={()=> goBack()}
                colorScheme='blue'
                aria-label='Back'
                size="lg"
                icon={<ChevronLeftIcon/>}
                fontSize="xl"
            />
            </Box>
        </Center>
    );
}

export default BackButton;

