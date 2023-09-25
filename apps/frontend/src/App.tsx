import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import checkAuthExpiration from "./auth/checkAuthExpiration";
import Header from "./components/header/Header";
import PrivateRoute from "./components/auth/PrivateRoute";
import Unauthorised from "./components/auth/Unauthorised";
import Users from "./components/users/Users";
import Signup from "./components/users/Signup";
import Login from "./components/users/Login";
import Logout from "./components/users/Logout";
import CreateProduct from "./components/products/CreateProduct";
import Products from "./components/products/Products";
import ProductDetail from "./components/products/ProductDetail";
import CheckoutProduct from "./components/products/CheckoutProduct";
import OrderDetail from "./components/orders/OrderDetail";
import RootPage from "./components/root/RootPage";
import { RootState } from "./reduxTypes/reduxTypes";

function App() {
    useEffect(() => {
        checkAuthExpiration();
    }, []);

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    return (
        <Router>
            <div className="App">
                <Header />
                <div className="main-wrapper">
                    <Routes>
                        {isLoggedIn ? (
                            <>
                                <Route path="/" element={<RootPage />} />
                                <Route path="/users" element={<Users />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/unauthorised" element={<Unauthorised />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/products/:id" element={<ProductDetail />} />
                                <Route
                                    path="/products/create"
                                    element={<PrivateRoute element={<CreateProduct />} />}
                                />
                                <Route path="/checkout/:id" element={<CheckoutProduct />} />
                                <Route
                                    path="/orders/:id"
                                    element={<PrivateRoute element={<OrderDetail />} />}
                                />
                                <Route path="/*" element={<RootPage />} />
                            </>
                        ) : (
                            <>
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/*" element={<Navigate to="/login" />} />
                            </>
                        )}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
