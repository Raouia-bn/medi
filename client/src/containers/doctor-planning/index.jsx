import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/section-title';
import DoctorAppointments from "../../components/doctor-planning";

const DoctorPlanningSection = () => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    // Récupérer les informations du médecin connecté depuis le localStorage
    const storedUser = localStorage.getItem('user');
   

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Vérifier le rôle de l'utilisateur et mettre à jour l'état doctor
      if (parsedUser.user && parsedUser.user.role === 'Doctor') {
        setDoctor(parsedUser.user); // Assurez-vous que l'objet utilisateur contient l'ID et le nom
      }
    }
  }, []);

  if (!doctor) {
    return <div>Chargement...</div>;
  }

  return (
    <section className="doctor-list-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up" data-aos-duration="1200">
            <SectionTitle classOption="text-center" title="<span>Le</span> Planning" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <DoctorAppointments doctor={doctor} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorPlanningSection;
