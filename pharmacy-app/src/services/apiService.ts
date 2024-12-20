import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/user'; // Remplacez par votre URL backend

// Définition des types pour les données envoyées et la réponse
interface RegisterData {
  name: string;
  email: string;
  password: string;
  address: string;
  zone: string;
  vehicle: string;

  phone: number;  // Nouveau champ (anciennement phoneNumber)
  role: string;   // Nouveau champ
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  message: string;
}

export const registerPharmacy = async (data: RegisterData): Promise<AuthResponse> => {
  console.log('Registering pharmacy with data:', data);  // Ajout de log pour vérifier les données
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error during registration:', error.response?.data || error.message);  // Log de l'erreur
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const loginPharmacy = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Login failed';
  }
};
