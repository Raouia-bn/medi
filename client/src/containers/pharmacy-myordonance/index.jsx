import React from 'react';
import SectionTitle from '../../components/section-title';
import PrescriptionList from '../../components/pharmacy-myOrdonance'; // Partie logique

const MyPrescriptionsSection = () => {
    return (
        <section className="doctor-list-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12" data-aos="fade-up" data-aos-duration="1200">
                        <SectionTitle classOption="text-center" title="<span>Prescription</span> accepted" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <PrescriptionList /> {/* Utilisation de la partie logique */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyPrescriptionsSection;
