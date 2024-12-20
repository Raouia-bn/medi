import React from "react";
import RegisterForm  from "../../components/register-form";
import SectionTitle from "../../components/section-title";

const Register = () => {
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
                                title="<span>Créer votre</span> Compte"
                            />
                            <RegisterForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
