import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import AppointmentFormPopup from './AppointmentFormPopup';
import { bookAppointment } from '../../api/appointmentApi';
import '../../assets/css/DoctorList.css';

const DoctorItem = ({ doctor }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleDayClick = (date) => {
    // Vérifiez si le jour cliqué est un jour non disponible
    const isUnavailable = doctor.unavailableDays.some(day => {
      const unavailableDate = new Date(day.date);
      return unavailableDate.toDateString() === date.toDateString();
    });

    // Si le jour est disponible, définissez la date sélectionnée et montrez le pop-up
    if (!isUnavailable) {
      setSelectedDate(new Date(date));
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
  };

  const handleFormSubmit = async (appointmentDetails) => {
    try {
      await bookAppointment(appointmentDetails);
      alert('Appointment booked successfully!');
    } catch (error) {
      alert('Failed to book appointment. Please try again.');
    }
    closePopup();
  };

  return (
    <div className="doctor-item">
      <div className="doctor-image">
        <img src="img/Dr.PNG" alt={`Dr. ${doctor.name}`} />
      </div>
      <div className="content">
        <h4 className="title">
          <Link to={`/doctor-details/${doctor._id}`}>{`Dr. ${doctor.name}`}</Link>
        </h4>
        <span>Specialty: {doctor.specialty}</span> <br />
        <span>Office Address: {doctor.address}</span> <br />
        <Calendar
  className="white-calendar"
  locale="en-US" 
  onClickDay={handleDayClick}
  tileDisabled={({ date }) => {
    const today = new Date();
    const isPastDate = date < today.setHours(0, 0, 0, 0); // Désactiver les dates passées
    const isUnavailable = doctor.unavailableDays.some(
      (day) => new Date(day.date).toDateString() === date.toDateString()
    );

    return isPastDate || isUnavailable; // Désactiver si c'est une date passée ou non disponible
  }}
/>

      </div>
      {showPopup && (
        <AppointmentFormPopup
          doctorId={doctor._id}
          selectedDate={selectedDate}
          onClose={closePopup}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

DoctorItem.propTypes = {
  doctor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    unavailableDays: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default DoctorItem;  