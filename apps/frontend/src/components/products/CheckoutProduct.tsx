import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { OrderRequest, Product } from "../../types";
import { RootState } from "../../reduxTypes/reduxTypes";

const CheckoutProduct = () => {
    const { id } = useParams();
    const user = useSelector((state: RootState) => state.auth.user);
    const [product, setProduct] = useState<Product | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalCost, setTotalCost] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState<OrderRequest>({
        userId: user?._id ?? "",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        shippingType: "Standard",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3000/products/${id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                const productData: Product = await response.json();
                if (productData.order_id) {
                    navigate("/products");
                } else {
                    setProduct(productData);
                }
                setIsLoading(false);
            } catch (error: unknown) {
                setIsLoading(false);
                if (error instanceof Error) {
                    setErrorMessage(`Failed to fetch product: ${error.message}`);
                    console.error("Failed to fetch product:", error.message);
                } else {
                    setErrorMessage("An unknown error occurred.");
                    console.error("An unknown error occurred.");
                }
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            const shippingCost = formData.shippingType === "Standard" ? 5.99 : 9.99;
            const productPrice = parseFloat(product.price);
            setTotalCost(productPrice + shippingCost);
        }
    }, [product, formData.shippingType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = `http://localhost:3000/products/${id}/purchase`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.log(response);
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to purchase the product");
            }

            const data = await response.json();
            console.log("Product purchased successfully:", data);
            setSuccessMessage("Purchase successful!");
            setIsSubmitted(true);
            setTimeout(() => {
                navigate("/products");
            }, 2000);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                console.error(error.message);
            } else {
                setErrorMessage("An unknown error occurred.");
                console.error("An unknown error occurred.");
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <div className="product-details">
                <h2>Product Details</h2>
                <p>Title: {product?.title}</p>
                <p>Category: {product?.category}</p>
                <p>Price: ${product?.price}</p>
                <p>Description: {product?.description}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                />
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                />
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                />
                <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    placeholder="Postcode"
                    required
                />
                <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="Card Number"
                    required
                    pattern="\d{13,19}"
                    title="Card number must be between 13 to 19 digits"
                />
                <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="Expiry Date (MM/YY)"
                    required
                    pattern="^(0[1-9]|1[0-2])\/([0-9]{2})$"
                    title="Enter a valid expiry date in MM/YY format"
                />
                <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="CVV"
                    required
                    pattern="\d{3,4}"
                    title="CVV must be 3 or 4 digits"
                />

                <select name="shippingType" value={formData.shippingType} onChange={handleChange}>
                    <option value="Standard">Standard Shipping - $5.99</option>
                    <option value="Express">Express Shipping - $9.99</option>
                </select>
                <p>Total Cost: ${totalCost.toFixed(2)}</p>
                <button type="submit" disabled={isSubmitted}>
                    Submit
                </button>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default CheckoutProduct;
