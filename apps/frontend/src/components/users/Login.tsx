import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../auth/authSlice";

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Sign in successful!");
                dispatch(login({ user: data.user, timestamp: new Date().getTime() }));
                navigate("/");
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Error occurred while logging in.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-heading">Sign In</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="login-input"
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="login-input"
                    placeholder="Password"
                />
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign In"}
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Login;
