import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dob: "",
        isAdmin: false,
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Signup successful!");
                navigate("/login");
            } else {
                setMessage(data.message || "Signup failed.");
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
            {isLoading ? (
                <h1 className="login-heading">Loading...</h1>
            ) : (
                <>
                    <h1 className="login-heading">Sign Up</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            placeholder="First Name"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            placeholder="Last Name"
                        />
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            required
                            placeholder="Date of Birth"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength={8}
                            placeholder="Password"
                        />
                        <label>
                            Admin User?
                            <input
                                type="checkbox"
                                name="isAdmin"
                                checked={formData.isAdmin}
                                onChange={handleInputChange}
                            />
                        </label>

                        <button type="submit">Sign Up</button>
                    </form>
                    <p>{message}</p>
                </>
            )}
        </div>
    );
};

export default Signup;
