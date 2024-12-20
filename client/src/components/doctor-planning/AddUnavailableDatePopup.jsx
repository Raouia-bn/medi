import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../../assets/css/DoctorList.css';
import '../../assets/css/planning.css';
const API_BASE_URL = 'http://localhost:5000/api/v1/user/doctor/unavailable-days';

const AddUnavailableDatePopup = ({ doctorId, onClose }) => {
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  const handleAddUnavailableDate = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      console.log('Doctor ID:', doctorId);
      console.log('Date:', date);
      console.log('Reason:', reason);
      
      const response = await axios.post(API_BASE_URL, { doctorId, date, reason }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response:', response.data);

      if (response.data.success) {
        alert('Unavailable date added successfully!');
        onClose(); // Close the popup after successful addition
      } else {
        alert('Failed to add unavailable date.');
      }
    } catch (error) {
      console.error('Error adding unavailable date:', error.response ? error.response.data : error.message);
    }
  };

  const handleCancel = () => {
    setDate(''); // Clear the date input if needed
    setReason(''); // Clear the reason input if needed
    onClose(); // Close the popup
  };

  return (
    <div className="popup-overlay" style={overlayStyle}>
      <div className="popup-content" style={popupStyle}>
        <h2>Add Unavailable Date</h2>
        <form onSubmit={handleAddUnavailableDate}>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={inputStyle}
          />
          <br />
          <label htmlFor="reason">Reason:</label>
          <input
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={inputStyle}
          />
          <div className="popup-actions">
            <button type="submit" style={buttonStyle}>Add</button>
            <button type="button" onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  width: '300px', // Adjust the width as needed
};

const inputStyle = {
  width: '100%', // Full width inputs
  padding: '10px',
  margin: '10px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '10px',
};

const cancelButtonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

AddUnavailableDatePopup.propTypes = {
  doctorId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddUnavailableDatePopup;
