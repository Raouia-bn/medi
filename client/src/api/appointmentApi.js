import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/appointment';

export const bookAppointment = async (appointmentData) => {
  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const response = await axios.post(`${API_BASE_URL}/book`, appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the authorization token in the headers
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error booking appointment:', error.response ? error.response.data : error.message); // Log the error response
    throw error; // Propagate the error
  }
};
export const fetchDoctorAppointments = async (date) => {
  const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  try {
    const response = await fetch(`/api/appointments?date=${formattedDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include authentication headers if necessary (like a JWT token)
           Authorization: `Bearer ${token}`
      },
    });
    const data = await response.json();
    if (data.success) {
      setAppointments(data.appointments);
    } else {
      setAppointments([]); // Reset appointments if fetch fails
    }
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
  }
};
