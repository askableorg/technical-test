import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxTypes/reduxTypes";
import AdminDropdown from "./AdminDropdown";

const Header = () => {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

    return (
        <header className="app-header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="header-title">
                        Online Store
                    </Link>
                    <nav className="header-nav">
                        {isLoggedIn ? (
                            <>
                                {isAdmin && (
                                    <div className="admin-menu">
                                        Admin
                                        <AdminDropdown />
                                    </div>
                                )}
                                <Link to="/users" className="nav-link">
                                    Users
                                </Link>
                                <Link to="/products" className="nav-link">
                                    Products
                                </Link>
                                <Link to="/logout" className="nav-link">
                                    Log Out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="nav-link">
                                    Sign Up
                                </Link>
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
