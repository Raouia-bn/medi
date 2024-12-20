import React, { useState } from "react";
import { registerUser } from "../../api/userApi"; 

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        phone: "",
        role: "",
        zone:"",
        specialty: "",
        experience: "",
        priceConsultation: "",
        birthday: "",
        insuranceNumber: "",
        payment: "",
        opening: "",
        vehicle: "",
        coverArea: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRoleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            role: e.target.value,
        }));
    };

    const validateFields = () => {
        const errors = {};
        
        if (formData.role === "Patient") {
            if (!formData.birthday) {
                errors.birthday = "Birthday is required.";
            }
            if (!formData.insuranceNumber) {
                errors.insuranceNumber = "Insurance number is required.";
            }
        }

        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length) {
            setError(validationErrors);
            return;
        }

        setLoading(true);
        setError(null); 
        try {
            await registerUser(formData); 
            setSuccess(true);
           
            setFormData({
                name: "",
                email: "",
                address: "",
                password: "",
                phone: "",
                role: "",
                zone:"",
                specialty: "",
                experience: "",
                priceConsultation: "",
                birthday: "",
                insuranceNumber: "",
                payment: "",
                opening: "",
                vehicle: "",
                coverArea: "",
            });
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError({ general: err.response.data.message });
            } else {
                setError({ general: "Registration failed." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="contact-form-wrapper"
            method="POST"
            onSubmit={onSubmit}
            data-aos="fade-up"
            data-aos-duration="1200"
        >
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            name="zone"
                            placeholder="Zone"
                            value={formData.zone}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group">
                        <select
                            className="form-control"
                            name="role"
                            value={formData.role}
                            onChange={handleRoleChange}
                        >
                            <option value="">Select Role</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Patient">Patient</option>
                            <option value="Pharmacy">Pharmacy</option>
                            <option value="Delivery">Delivery</option>
                        </select>
                    </div>
                </div>

                {formData.role === "Doctor" && (
                    <>
                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="specialty"
                                    placeholder="Specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        

                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="experience"
                                    placeholder="Years of Experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="priceConsultation"
                                    placeholder="Consultation Price"
                                    value={formData.priceConsultation}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </>
                )}

                {formData.role === "Patient" && (
                    <>
                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="date"
                                    name="birthday"
                                    placeholder="Birthday"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                />
                                {error && error.birthday && (
                                    <p className="error-message">{error.birthday}</p>
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="insuranceNumber"
                                    placeholder="Insurance Number"
                                    value={formData.insuranceNumber}
                                    onChange={handleChange}
                                />
                                {error && error.insuranceNumber && (
                                    <p className="error-message">{error.insuranceNumber}</p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {formData.role === "Pharmacy" && (
                    <>
                       
                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="opening"
                                    placeholder="Opening Hours"
                                    value={formData.opening}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </>
                )}

                {formData.role === "Delivery" && (
                    <>
                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="vehicle"
                                    placeholder="Vehicle"
                                    value={formData.vehicle}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="coverArea"
                                    placeholder="Coverage Area"
                                    value={formData.coverArea}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="col-md-12 text-center">
                    <div className="form-group">
                        <button type="submit" style={{ width: '40%', margin: '0 auto' }} 
                            className="btn btn-theme"
                            disabled={loading}>
                            Create Account
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="col-md-12">
                        <p className="error-message" style={{ color: 'red' }}>{error.general}</p>
                    </div>
                )}

                {success && (
                    <div className="col-md-12">
                        <p className="success-message" style={{ color: 'green' }}>Registration successful!</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default RegisterForm;
