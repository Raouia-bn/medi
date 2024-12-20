import React from "react";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Login from "../containers/login";

const LoginPage = () => {
    return (
        <React.Fragment>
            <Layout>
                <div className="wrapper">
                    <Header />
                    
                    <div className="main-content site-wrapper-reveal">
                        <Login />
                    </div>
                    <Footer />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default LoginPage;
