import mongoose from 'mongoose';


const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment', // Reference to the Appointment model
    required: true,
  },
  medications: [{
             name: {
                  type: String,
                  required: true,
              },
            
              quantity: {
                  type: Number,
                  required: false,
              },
              refuser: {
                type: Number,
                required: false,
            },
              usageInstructions: {
                  type: String,
                  required: true,
                  default:""
              },
              durations: {
                type: String,
                required: true,
                default:""
            },
            status: {
              type: String,
              enum: ["does not exist", "exists"],
              default: "exists",
            },
              Check: {
                  type: Boolean,
                  required: true,
                  default: false,
              },
              PharmacyAcceptedmedication: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',  // Référence à l'utilisateur avec le rôle "Pharmacy"
                  required: false,
                },
              price: {
                  type: Number,
                  required: true,
                  default: 0,
              },
  }],
  prescriptionAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted by pharmacy","Not completed","Completed by pharmacy", "Accepted by livreur", "Deliver livreur","Deliver Patient"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  PharmacyAccepted:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Référence à l'utilisateur avec le rôle "Pharmacy"
      required: false,
    }
  ],
  livreurAccepted: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User schema with role "Livreur"
    required: false,
  },
  livreurAmount:{
    type: Number,
    required: true,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  dateAcceptedLivraison: {
    type: Date,
    default: Date.now,
  },
  dateLivraisonAt: {
    type: Date,
    default: Date.now,
  },
});


export const Prescription = mongoose.model('Prescription', prescriptionSchema);
