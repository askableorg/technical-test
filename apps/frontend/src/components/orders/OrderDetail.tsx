import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Order, User, Product } from "../../types";

const OrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [orderDetails, setOrderDetails] = useState<{
        order: Order;
        product: Product;
        user: User;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/orders/${id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                const data: {
                    order: Order;
                    product: Product;
                    user: User;
                } = await response.json();
                setOrderDetails(data);
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "An unknown error occurred";
                setError(`Failed to fetch order: ${errorMessage}`);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const formattedDateTime = useMemo(() => {
        return orderDetails && orderDetails.order.createdDate
            ? new Date(orderDetails.order.createdDate).toLocaleString()
            : null;
    }, [orderDetails]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-detail-container">
            <h1>Order Details for: {orderDetails?.product.title}</h1>
            <p>
                <b>User:</b> {orderDetails?.user.firstName} {orderDetails?.user.lastName}
            </p>
            <p>
                <b>Order Date:</b> {formattedDateTime}
            </p>
            <p>
                <b>Address:</b> {orderDetails?.order.address}, {orderDetails?.order.city},{" "}
                {orderDetails?.order.state} {orderDetails?.order.postcode}
            </p>
            <p>
                <b>Shipping Type:</b> {orderDetails?.order.shippingType}
            </p>
            <Link
                to={`/products/${orderDetails?.order.productId}`}
                className="back-to-product-button"
            >
                Back to Product
            </Link>
        </div>
    );
};

export default OrderDetail;
