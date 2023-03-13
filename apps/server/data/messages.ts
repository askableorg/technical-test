export const ApiErrors = {
    PRODUCT_NOT_FOUND: (productId: string): string => {
        return `The product with id ${productId} does not exist`;
    },
    ORDER_BY_PRODUCT_ID_NOT_FOUND: (productId: string): string => {
        return `The order associated with the product id ${productId} does not exist`;
    },
    PRODUCT_WAS_ALREADY_PURCHASED: (productId: string): string => {
        return `The product with id ${productId} was already purchased`;
    },
    ORDER_NOT_FOUND: (orderId: string): string => {
        return `The order with id ${orderId} does not exist`;
    },
}