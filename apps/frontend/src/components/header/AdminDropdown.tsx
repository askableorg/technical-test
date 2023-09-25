import { Link } from "react-router-dom";

const AdminDropdown = () => {
    return (
        <div className={`admin-dropdown`}>
            <Link to="/products/create" className="dropdown-item">
                Create Product
            </Link>
        </div>
    );
};

export default AdminDropdown;
