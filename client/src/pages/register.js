import React from "react";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Register from "../containers/register";

const RegisterPage = () => {
    return (
        <React.Fragment>
            <Layout>
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <Register />
                    </div>
                    <Footer />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default RegisterPage;
