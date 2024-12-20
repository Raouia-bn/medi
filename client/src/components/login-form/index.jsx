import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../../api/userApi';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!email) {
            newErrors.email = "Email is required";
        }
        if (!password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            const response = await loginUser(email, password);
            console.log("Login successful:", response);

            localStorage.setItem("authToken", response.token);

            localStorage.setItem("user", JSON.stringify(response.user));            
            history.push("/");
        } catch (error) {
            if (error.response) {
                setErrors({ server: error.response.data.message });
            } else {
                setErrors({ server: "Login failed, please check your credentials" });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contact-form-wrapper">
            <div className="row justify-content-center">
                <div className="col-12 text-center">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            style={{ width: '40%', margin: '0 auto' }} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </div>
                </div>
                <div className="col-12 text-center">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Password"
                            value={password}
                            style={{ width: '40%', margin: '0 auto' }} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>
                </div>
                <div className="col-12 text-center">
                    <div className="form-group">
                        <button
                            className="btn btn-theme"
                            type="submit"
                            style={{ width: '40%', margin: '0 auto' }} 
                        >
                            Login
                        </button>
                    </div>
                    <p className="mt-3">
                        Don&apos;t have an account?{" "}
                        <a href="/register" className="text-theme">Create one</a>
                    </p>
                    {errors.server && <p style={{ color: 'red' }}>{errors.server}</p>}
                </div>
            </div>
        </form>
    );
};

export default LoginForm;
