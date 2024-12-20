import React from 'react';
import Layout from '../layouts/index.jsx';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import PendingPrescriptionsSection from '../containers/pharmacy-ordonance'; // Mise à jour ici

const PharmacyOrdonancePage = () => {
    return (
        <React.Fragment>
            <Layout>
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <PendingPrescriptionsSection /> {/* Utilisation de DoctorListSection */}
                    </div>
                    <Footer />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default PharmacyOrdonancePage;