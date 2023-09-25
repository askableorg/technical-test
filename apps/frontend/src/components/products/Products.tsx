import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Product } from "../../types";
import PageNumbers from "../pagination/PageNumbers";
import { RootState } from "../../reduxTypes/reduxTypes";

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

    const openDeleteModal = (productId: string) => {
        setProductToDelete(productId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (productToDelete) {
            try {
                const response = await fetch(`http://localhost:3000/products/${productToDelete}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                const data = await response.json();
                console.log(data.message);
                setProducts(products.filter((product) => product._id !== productToDelete));
            } catch (error) {
                console.error("Failed to delete product:", (error as Error).message);
            } finally {
                closeDeleteModal();
            }
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/products");
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error) {
                setError("Failed to fetch products: " + (error as Error).message);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let sortedProducts = [...products];

        if (sortOrder === "price-asc") {
            sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortOrder === "price-desc") {
            sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortOrder === "date-asc") {
            sortedProducts.sort(
                (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
        } else if (sortOrder === "date-desc") {
            sortedProducts.sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        }

        setSortedProducts(sortedProducts);
    }, [sortOrder, products]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="product-list-container">
            <h1>Products</h1>
            {isAdmin && (
                <div className="create-product-button-container">
                    <Link to="/products/create">
                        <button className="create-product-button">Create Product</button>
                    </Link>
                </div>
            )}
            <select onChange={handleSortChange} value={sortOrder} className="sort-dropdown">
                <option value="">Sort by...</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="date-asc">Date (Old to New)</option>
                <option value="date-desc">Date (New to Old)</option>
            </select>
            <select
                onChange={handleItemsPerPageChange}
                value={itemsPerPage}
                className="sort-dropdown"
            >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
            </select>
            {error && <div className="error">{error}</div>}
            <ul className="product-list">
                {sortedProducts
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((product) => (
                        <li className="product-item" key={product._id}>
                            <Link to={`/products/${product._id}`} className="product-item-link">
                                {product.order_id && <div className="sold-indicator">Sold</div>}
                                <div className="product-info">
                                    <h2>{product.title}</h2>
                                    <p>Category: {product.category}</p>
                                    <p>Price: {product.price}</p>
                                </div>
                                {isAdmin && (
                                    <div className="delete-button-container">
                                        <button
                                            className="delete-product-button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openDeleteModal(product._id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </Link>
                        </li>
                    ))}
            </ul>
            <PageNumbers
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={sortedProducts.length}
                handlePageChange={handlePageChange}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDeleteConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default Products;
