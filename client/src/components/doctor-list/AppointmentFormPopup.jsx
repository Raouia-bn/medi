import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/DoctorList.css';

const AppointmentFormPopup = ({ doctorId, selectedDate, onClose, onSubmit }) => {
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  // Generate time slots from 9:00 to 17:30 with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    let currentHour = 9;
    let currentMinute = 0;

    while (currentHour < 18 || (currentHour === 17 && currentMinute <= 30)) {
      const time = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      slots.push(time);
      currentMinute += 30;
      if (currentMinute === 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    return slots;
  };

  const handleSlotClick = (time) => {
    setSelectedTime(time);
    setError(''); // Clear any previous error
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedTime) {
      setError('Please select a time slot.');
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes, 0, 0); // Set selected time on the date

    if (appointmentDate < new Date()) {
      setError('You cannot book an appointment in the past.');
      return;
    }

    const appointmentDetails = {
      doctorId,
      date: appointmentDate.toISOString().split('T')[0],
      time: selectedTime,
    };

    onSubmit(appointmentDetails);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="close" onClick={onClose} aria-label="Close popup">
          &times;
        </button>
        <h3>Book Appointment for {selectedDate.toLocaleDateString()}</h3>
        <div className="time-slots">
          {generateTimeSlots().map((time) => (
            <button
              key={time}
              type="button"
              className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => handleSlotClick(time)}
            >
              {time}
            </button>
          ))}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleSubmit} className="btn-blue">Confirm</button>
      </div>
    </div>
  );
};

AppointmentFormPopup.propTypes = {
  doctorId: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AppointmentFormPopup;
