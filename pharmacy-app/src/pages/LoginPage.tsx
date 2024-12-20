import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { loginPharmacy } from '../services/apiService';
import '../theme/LoginPage.css'; // Import du fichier CSS

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      setShowToast(true);
      return;
    }

    try {
      const data = await loginPharmacy(email, password);
      localStorage.setItem('authToken', data.token);
      history.push('/dashboard');
    } catch (err: any) {
      setError(err);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header">
          <IonTitle className="header-title">Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="home-page">
        <div className="container">
          <h2 className="title">Welcome Back</h2>
          <IonItem className="input-item">
            <IonLabel position="stacked">Email Address</IonLabel>
            <IonInput
              type="email"
              placeholder="hello@example.com"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>
          <IonItem className="input-item">
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
          </IonItem>
          <IonButton expand="block" onClick={handleLogin} className="login-button">
            Login
          </IonButton>
        
         
          <p className="footer-text">
            Don't have an account?{' '}
            <a href="/register" className="footer-link">
              Sign up
            </a>
          </p>
        </div>
        <IonToast
          isOpen={showToast}
          message={error || ''}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
