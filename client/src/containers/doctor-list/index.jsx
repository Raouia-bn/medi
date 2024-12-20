import React from 'react';
import SectionTitle from '../../components/section-title';
import DoctorList from '../../components/doctor-list'; // Partie logique

const DoctorListSection = () => {
    return (
        <section className="doctor-list-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12" data-aos="fade-up" data-aos-duration="1200">
                        <SectionTitle classOption="text-center" title="<span>List</span> of Doctors" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <DoctorList /> {/* Utilisation de la partie logique */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoctorListSection;
