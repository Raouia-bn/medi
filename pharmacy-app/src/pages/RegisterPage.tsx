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
import { registerPharmacy } from '../services/apiService';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [zone, setZone] = useState('');
  const [vehicle, setVehicle] = useState('');
 
  const [phone, setPhone] = useState('');
  const [role] = useState('Delivery');
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
 

    // Validation simple
    if (!name || !email || !password || !address || !zone || !vehicle  || !phone) {
      setError('Please fill in all fields.');
      setShowToast(true);
      return;
    }

    try {
      // Appel API d'inscription avec les nouveaux champs
      const data = await registerPharmacy({ name, email, password, address, zone, vehicle,  phone, role });
      setSuccess(true);
      // Réinitialiser les champs après succès
      setName('');
      setEmail('');
      setPassword('');
      setAddress('');
      setZone('');
      setVehicle('');
    
      setPhone('');
    } catch (err: any) {
      setError(err);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ color: '#407BFF' }}> {/* MediBridge blue color */}
          <IonTitle style={{ color: '#407BFF', textAlign: 'center' }}>Register</IonTitle> {/* Title in white and centered */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Pharmacy Name</IonLabel>
          <IonInput
            placeholder="Enter pharmacy name"
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="email"
            placeholder="Enter email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            placeholder="Enter password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Phone</IonLabel>
          <IonInput
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onIonChange={(e) => setPhone(e.detail.value!)}
        
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Address</IonLabel>
          <IonInput
            placeholder="Enter address"
            value={address}
            onIonChange={(e) => setAddress(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Coverarea</IonLabel>
          <IonInput
            placeholder="Enter Coverarea"
            value={zone}
            onIonChange={(e) => setZone(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Vehicle</IonLabel>
          <IonInput
            placeholder="Enter vehicle"
            value={vehicle}
            onIonChange={(e) => setVehicle(e.detail.value!)}
          />
        </IonItem>
      
      

        <IonButton  expand="block" onClick={handleRegister}>
          Register
        </IonButton>
        <p className="ion-text-center">
          Already have an account?{' '}
          <a href="/login" style={{ color: 'blue' }}>Login</a> {/* Green color for the Login link */}
        </p>

        <IonToast
          isOpen={showToast}
          message={error || ''}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
        <IonToast
          isOpen={success}
          message="Registration successful!"
          duration={2000}
          onDidDismiss={() => setSuccess(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
