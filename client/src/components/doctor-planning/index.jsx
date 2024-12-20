import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrescriptionBottle } from '@fortawesome/free-solid-svg-icons';

import '../../assets/css/DoctorList.css';
import '../../assets/css/planning.css';
import AddUnavailableDatePopup from './AddUnavailableDatePopup'; // Import the popup

import CreatePrescriptionPopup from './CreatePrescriptionPopup';

const API_BASE_URL = 'http://localhost:5000/api/v1/appointment/appointments';
const UNAVAILABLE_DAYS_API_URL = 'http://localhost:5000/api/v1/user/doctor/unavailable-days';

const DoctorAppointments = ({ doctor }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [unavailableDays, setUnavailableDays] = useState([]);
  const [activeAppointmentId, setActiveAppointmentId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const [appointmentIdForPrescription, setAppointmentIdForPrescription] = useState(null);
  const [patientIdForPrescription, setPatientIdForPrescription] = useState(null);

  // Fetch appointments for a specific doctor and date
  const fetchDoctorAppointments = useCallback(async (doctorId, date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}?date=${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        console.error('Error fetching appointments:', response.data.message);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error.response ? error.response.data : error.message);
      setAppointments([]);
    }
  }, []);

  // Fetch unavailable days for the doctor
  const fetchUnavailableDays = useCallback(async (doctorId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${UNAVAILABLE_DAYS_API_URL}?doctorId=${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setUnavailableDays(response.data.unavailableDays);
      } else {
        console.error('Error fetching unavailable days:', response.data.message);
        setUnavailableDays([]);
      }
    } catch (error) {
      console.error('Failed to fetch unavailable days:', error.response ? error.response.data : error.message);
      setUnavailableDays([]);
    }
  }, []);

  useEffect(() => {
    if (doctor?._id) {
      fetchDoctorAppointments(doctor._id, selectedDate);
      fetchUnavailableDays(doctor._id);
    }
  }, [fetchDoctorAppointments, fetchUnavailableDays, doctor, selectedDate]);

  const handleDayClick = (date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // Check if the clicked day is unavailable
    const unavailableDay = unavailableDays.find((unavailableDate) => new Date(unavailableDate.date).toLocaleDateString() === date.toLocaleDateString());

    if (unavailableDay) {
      // Confirm deletion
      const confirm = window.confirm(`Are you sure you want to delete the unavailable day on ${formattedDate}?`);
      if (confirm) {
        deleteUnavailableDay(unavailableDay._id);
      }
    } else {
      setSelectedDate(date);
      fetchDoctorAppointments(doctor._id, date);
    }
  };

  const deleteUnavailableDay = async (dayId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`${UNAVAILABLE_DAYS_API_URL}/${dayId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setUnavailableDays((prevDays) => prevDays.filter(day => day._id !== dayId));
        alert('Unavailable day deleted successfully!');
      } else {
        console.error('Error deleting unavailable day:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to delete unavailable day:', error.response ? error.response.data : error.message);
    }
  };

  const handleConfirm = async (appointmentId) => {
    const confirm = window.confirm('Are you sure you want to confirm this appointment?');
    if (confirm) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.put(`${API_BASE_URL}/${appointmentId}/confirm`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment._id === appointmentId ? { ...appointment, status: 'confirmed' } : appointment
            )
          );
          setActiveAppointmentId(appointmentId);
          alert('Appointment confirmed!');
        } else {
          console.error('Error confirming appointment:', response.data.message);
        }
      } catch (error) {
        console.error('Failed to confirm appointment:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE_URL}/${appointmentId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        alert('Appointment completed!');
      } else {
        console.error('Error completing appointment:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to complete appointment:', error.response ? error.response.data : error.message);
    }
  };

  const handleCancel = async (appointmentId) => {
    const confirm = window.confirm('Are you sure you want to cancel this appointment?');
    if (confirm) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.put(`${API_BASE_URL}/${appointmentId}/cancel`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          alert('Appointment canceled!');
        } else {
          console.error('Error canceling appointment:', response.data.message);
        }
      } catch (error) {
        console.error('Failed to cancel appointment:', error.response ? error.response.data : error.message);
      }
    }
  };

  const groupAppointments = (appointments) => {
    const grouped = [];
    for (let i = 0; i < appointments.length; i += 3) {
      grouped.push(appointments.slice(i, i + 3));
    }
    return grouped;
  };

  const groupedAppointments = groupAppointments(appointments);

  return (
    <div className="doctor-appointments">
      <div className="appointments-container">
        <button className="btn-blue" onClick={() => setIsPopupOpen(true)}>Add Unavailable Date</button> {/* Add the button here */}
        {isPopupOpen && (
          <AddUnavailableDatePopup
            doctorId={doctor._id}
            onClose={() => setIsPopupOpen(false)} // Close popup handler
          />
        )}
        <Calendar
          className="white-calendar cc"
          onClickDay={handleDayClick}
          value={selectedDate}
          locale="en-US"
          tileClassName={({ date }) => {
            const isUnavailable = unavailableDays.some(
              (unavailableDate) => new Date(unavailableDate.date).toLocaleDateString() === date.toLocaleDateString()
            );
            return isUnavailable ? 'unavailable' : '';
          }}
        />
        <div className="appointments-section">
        <h3>Appointments for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>

          <div className="appointments-grid">
            {groupedAppointments.map((row, index) => (
              <div className="appointments-row" key={index}>
                {row.map((appointment) => (
                  <div key={appointment._id} className="appointment-card">
                    <h4 >{appointment.patient.name}</h4>
                    <p>Phone: {appointment.patient.phone}</p>
                    <p>Time: {appointment.time} - {appointment.endTime}</p>
                    {appointment.isCompleted ? (
                      <>
                      
                        <div  className="appointment-actions">
                          <button 
                            className="btn-prescription" 
                            onClick={() => {
                              setAppointmentIdForPrescription(appointment._id);
                              setPatientIdForPrescription(appointment.patient._id);
                            }}>
                        Prescription
                          </button>
                          
                        </div>
                      </>
                    ) : appointment.status === 'canceled' ? (
                      <p className="status-canceled" style={{ color: 'red' }}>Canceled Session</p>
                    ) : (
                      <div className="appointment-actions">
                        {activeAppointmentId !== appointment._id && (
                          <>
                            <button className="btn-confirm" onClick={() => handleConfirm(appointment._id)}>
                              Confirm
                            </button>
                            <button className="btn-cancel" onClick={() => handleCancel(appointment._id)}>
                              Cancel
                            </button>
                          </>
                        )}
                        {activeAppointmentId === appointment._id && (
                          <button className="btn-complete" onClick={() => handleComplete(appointment._id)}>
                            Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {appointmentIdForPrescription && patientIdForPrescription && (
        <CreatePrescriptionPopup
      
          appointmentId={appointmentIdForPrescription}
          patientId={patientIdForPrescription}
          onClose={() => {
            setAppointmentIdForPrescription(null);
            setPatientIdForPrescription(null);
          }}
        />
      )}
    </div>
  );
};

DoctorAppointments.propTypes = {
  doctor: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default DoctorAppointments;
