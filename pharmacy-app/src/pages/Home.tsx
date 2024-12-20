import React from "react";
import { IonContent, IonPage, IonButton, IonText } from "@ionic/react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="home-page" fullscreen>
        <div className="container">
          {/* Image plus grande et centrée */}
          <img
            src="image.PNG"  // Remplacez par l'URL ou le chemin de votre image
            alt="Dream Job Illustration"
            className="illustration"
          />
          
          {/* Titre plus grand et centré */}
          <IonText className="title">
            Welcome to <br /> MediBridge
          </IonText>

          <IonText className="subtitle">
  Join MediBridge as a delivery driver and ensure timely medication delivery to patients.<br></br> Make a difference today!
</IonText>


          
          <div className="buttons">
            {/* Boutons plus petits et avec la couleur personnalisée */}
            <IonButton  color="#407BFF" routerLink="/login" className="login-button">
              Login
            </IonButton>
            <IonButton  color="#407BFF" routerLink="/login" className="register-button">
              Register
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
