import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Product } from "../../types";
import { RootState } from "../../reduxTypes/reduxTypes";
import { useSelector } from "react-redux";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/${id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                const data: Product = await response.json();
                setProduct(data);
            } catch (error) {
                setError("Failed to fetch product: " + (error as Error).message);
            }
        };

        fetchProduct();
    }, [id]);

    const handleBuyNow = () => {
        navigate(`/checkout/${product?._id}`);
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail-container">
            <h1>{product.title}</h1>
            {product.order_id && <div className="sold-indicator">Sold</div>}

            <p>Category: {product.category}</p>
            <p>Price: {product.price}</p>
            <p>Description: {product.description}</p>
            <button onClick={handleBuyNow} disabled={!!product.order_id} className="buy-now-button">
                Buy Now
            </button>
            {isAdmin && product.order_id && (
                <Link to={`/orders/${product.order_id}`} className="order-button">
                    See Order Details
                </Link>
            )}
        </div>
    );
};

export default ProductDetail;
