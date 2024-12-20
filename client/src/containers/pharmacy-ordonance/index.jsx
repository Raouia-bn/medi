import React from 'react';
import SectionTitle from '../../components/section-title';
import PendingPrescriptions from '../../components/pharmacy-ordonance'; // Partie logique

const PendingPrescriptionsSection = () => {
    return (
        <section className="doctor-list-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12" data-aos="fade-up" data-aos-duration="1200">
                        <SectionTitle classOption="text-center" title="<span>List</span> of Prescription" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <PendingPrescriptions /> {/* Utilisation de la partie logique */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PendingPrescriptionsSection;
