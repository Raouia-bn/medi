import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/user';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data.message : error.message;
    }
};
export const loginUser = async (email, password) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
          email,
          password,
      });
      // Enregistrer le token dans localStorage
      localStorage.setItem("token", response.data.token);
      return response.data;
  } catch (error) {
      throw error.response ? error.response.data.message : error.message;
  }
};


export const logoutUser = () => async (dispatch) => {
    try {
        await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
        dispatch(userSlice.actions.logoutSuccess());
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.logoutFailed(error.response.data.message));
    }
};
export const getDoctors = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found. User may not be authenticated.");
        return; // Ou rediriger vers la page de connexion
    }

    const response = await axios.get(`${API_BASE_URL}/doctors`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
console.log(response.data)
    return response.data; // Retourner les données des médecins
   
  } catch (error) {
    console.error("Erreur lors de la récupération des médecins:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
};



export const getDoctorPlanning = async (doctorId) => {
  try {
      const token = localStorage.getItem("token");
      if (!token) {
          throw new Error("User not authenticated.");
      }
      console.log("aaaa",response.data)
      const response = await axios.get(`${API_BASE_URL}/doctor/${doctorId}/schedule`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      console.log("aaaa",response.data)

      return response.data; // Retourner le planning du médecin
  } catch (error) {
      throw error.response ? error.response.data : error;
  }
};
// services/apiService.js



// Fetch Doctor's Calendar Data
export const fetchDoctorCalendar = async (doctorId) => {
  try {
    const response = await axios.get(`${API_URL}/doctor/${doctorId}/calendar`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor calendar data", error);
    throw error;
  }
};

// Update Unavailable Days
export const updateUnavailableDays = async (date) => {
  try {
    const response = await axios.post(`${API_URL}/doctor/unavailable-days`, { date });
    return response.data;
  } catch (error) {
    console.error("Error updating unavailable days", error);
    throw error;
  }
};
