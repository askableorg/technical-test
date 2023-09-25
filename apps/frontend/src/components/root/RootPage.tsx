import { useNavigate } from "react-router-dom";

export const RootPage = () => {
    const navigate = useNavigate();
    return (
        <div className="root-container">
            <div className="root-buttons">
                <button
                    className="root-button"
                    onClick={() => {
                        navigate("/users");
                    }}
                >
                    Users
                </button>
                <button
                    className="root-button"
                    onClick={() => {
                        navigate("/products");
                    }}
                >
                    Products
                </button>
            </div>
        </div>
    );
};

export default RootPage;
