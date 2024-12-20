import React from 'react';
import Layout from '../layouts/index.jsx';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import DoctorDashboard from '../containers/doctor-list'; // Mise à jour ici

const DoctorListPage = () => {
    return (
        <React.Fragment>
            <Layout>
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <DoctorDashboard /> {/* Utilisation de DoctorListSection */}
                    </div>
                    <Footer />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default DoctorListPage;
