import React from "react";
import DoctorPlanningSection from "../containers/doctor-planning";
import Layout from '../layouts/index.jsx';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
const DoctorUnavailableDaysPage = () => {
  return (
    <React.Fragment>
    <Layout>
        <div className="wrapper">
            <Header />
            <div className="main-content site-wrapper-reveal">
            <DoctorPlanningSection /> {/* Utilisation de DoctorListSection */}
            </div>
            <Footer />
        </div>
    </Layout>
    </React.Fragment>
  );
};

export default DoctorUnavailableDaysPage;
