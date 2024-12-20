import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Référence à l'utilisateur avec le rôle "Doctor"
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Référence à l'utilisateur avec le rôle "Patient"
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,  // Heure de début du rendez-vous (au format "HH:mm")
    required:true,
  },
  endTime: {
    type: String,  // Heure de fin du rendez-vous (au format "HH:mm")
    required: false, // sera calculée automatiquement
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled'],
    default: 'pending',
  },
  isCompleted: {
    type: Boolean,
    default: false,  // Par défaut, un rendez-vous est considéré comme non terminé
  },
});

// Middleware pour définir l'heure de fin par défaut (30 minutes après l'heure de début)
appointmentSchema.pre('save', function (next) {
  if (this.time && !this.endTime) {
    const [hours, minutes] = this.time.split(':').map(Number);
    const endTimeDate = new Date();
    endTimeDate.setHours(hours);
    endTimeDate.setMinutes(minutes + 30);

    // Formater l'heure de fin au format "HH:mm"
    this.endTime = `${endTimeDate.getHours().toString().padStart(2, '0')}:${endTimeDate.getMinutes().toString().padStart(2, '0')}`;
  }
  next();
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);

