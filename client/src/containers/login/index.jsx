import React from "react";
import LoginForm  from "../../components/login-form";
import SectionTitle from "../../components/section-title";

const Login = () => {
    return (
        <section className="contact-area">
            <div className="container">
                <div className="row">
                    <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        data-aos-duration="1200"
                    >
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="contact-form">
                            <SectionTitle
                                classOption="text-center"
                                title="<span>Sign </span> In"
                                />
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
