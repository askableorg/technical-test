import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        title: "",
        category: "",
        price: "",
        description: "",
    });
    const [message, setMessage] = useState("");
    const [shouldNavigate, setShouldNavigate] = useState(false);

    useEffect(() => {
        if (shouldNavigate) {
            navigate("/products");
        }
    }, [shouldNavigate, navigate]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setProductData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Product creation successful!");
                setShouldNavigate(true);
            } else {
                setMessage(data.message || "Product creation failed.");
            }
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                setMessage(`Error occurred while creating product: ${error.message}`);
            } else {
                setMessage(`An unexpected error occurred: ${JSON.stringify(error)}`);
            }
        }
    };

    return (
        <div className="create-product-container">
            <h1 className="create-product-heading">Create New Product</h1>
            <form className="create-product-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={productData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                    className="create-product-input"
                />
                <select
                    id="category"
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    required
                    className="create-product-select"
                >
                    <option value="" disabled>
                        Select a category
                    </option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Watches">Watches</option>
                    <option value="Hats">Hats</option>
                </select>
                <textarea
                    id="description"
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                    className="create-product-input"
                    rows={4}
                    cols={50}
                />
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                    className="create-product-input"
                />

                <button type="submit" className="create-product-submit">
                    Create Product
                </button>
                <p className="create-product-message">{message}</p>
            </form>
        </div>
    );
};

export default CreateProduct;
