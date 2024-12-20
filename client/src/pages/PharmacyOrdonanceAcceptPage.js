import React from 'react';
import Layout from '../layouts/index.jsx';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import MyPrescriptionsSection from '../containers/pharmacy-myordonance'; // Mise à jour ici

const PharmacyOrdonanceAcceptPage = () => {
    return (
        <React.Fragment>
            <Layout>
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                      <MyPrescriptionsSection></MyPrescriptionsSection> {/* Utilisation de DoctorListSection */}
                    </div>
                    <Footer />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default PharmacyOrdonanceAcceptPage;