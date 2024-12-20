import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";


// Prendre un rendez-vous
export const bookAppointment = catchAsyncErrors(async (req, res, next) => {
  const { doctorId, date, time } = req.body;
  const patientId = req.user._id;

  // Récupérer les informations du docteur
  const doctor = await User.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found." });
  }

  // Vérification si la date et l'heure sont déjà passées
  const appointmentDateTime = new Date(`${date}T${time}`);
  const currentDateTime = new Date();

  if (appointmentDateTime < currentDateTime) {
    return res.status(400).json({ message: "You cannot book an appointment in the past." });
  }

  // Vérification des jours non disponibles du docteur
  const isUnavailable = doctor.unavailableDays.some((unavailable) => {
    const unavailableDate = new Date(unavailable.date).toDateString();
    const appointmentDay = new Date(date).toDateString();

    if (unavailableDate === appointmentDay) {
      const startTime = new Date(`${date}T${unavailable.startTime}`);
      const endTime = new Date(`${date}T${unavailable.endTime}`);
      return appointmentDateTime >= startTime && appointmentDateTime < endTime;
    }
    return false;
  });

  if (isUnavailable) {
    return res.status(400).json({ message: "Doctor is unavailable during this time." });
  }

  // Calculer l'heure de fin du rendez-vous
  const [appointmentHours, appointmentMinutes] = time.split(':').map(Number);
  const endAppointmentTime = new Date(appointmentDateTime);
  endAppointmentTime.setMinutes(endAppointmentTime.getMinutes() + 30); // Ajouter 30 minutes

  // Vérification si le créneau est déjà réservé
  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date,
    $or: [
      {
        // Check if there is an appointment that starts before the new appointment ends
        time: {
          $lt: endAppointmentTime.toTimeString().slice(0, 5), // Existing appointment ends after the new appointment starts
        },
        endTime: {
          $gt: time, // Existing appointment starts before the new appointment ends
        },
      },
    ],
  });

  if (existingAppointment) {
    return res.status(400).json({ message: "This time slot is already booked." });
  }

  // Réservation du rendez-vous
  const appointment = await Appointment.create({
    doctor: doctorId,
    patient: patientId,
    date,
    time,
  });

  res.status(201).json({
    success: true,
    appointment,
  });
});



export const getAppointmentsByDate = catchAsyncErrors(async (req, res, next) => {
  const { date } = req.query;

  // Assuming you have middleware to set req.user with the authenticated doctor
  const doctorId = req.user._id; // Get the doctor ID from the authenticated user

  // Fetch appointments for the connected doctor on the specified date
  const appointments = await Appointment.find({
    doctor: doctorId,
    date: { $eq: date },  // Use date directly from req.query
  }).populate('patient', 'name email phone birthday');

  console.log("Appointments fetched:", appointments);
  res.status(200).json({
    success: true,
    appointments,
  });
});
// Dans votre contrôleur

export const completeAppointment = catchAsyncErrors(async (req, res, next) => {
  const appointmentId = req.params.id;

  // Mettre à jour le rendez-vous en définissant isCompleted à true
  const appointment = await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true }, { new: true });

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found." });
  }

  res.status(200).json({
    success: true,
    message: "Appointment completed successfully.",
    appointment,
  });
});
// Dans votre contrôleur

export const confirmAppointment = catchAsyncErrors(async (req, res, next) => {
  const appointmentId = req.params.id;

  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: 'confirmed' }, // Changer l'état à 'confirmed'
    { new: true }
  );

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found." });
  }

  res.status(200).json({
    success: true,
    message: "Appointment confirmed successfully.",
    appointment,
  });
});

export const cancelAppointment = catchAsyncErrors(async (req, res, next) => {
  const appointmentId = req.params.id;

  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: 'canceled' }, // Changer l'état à 'canceled'
    { new: true }
  );

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found." });
  }

  res.status(200).json({
    success: true,
    message: "Appointment canceled successfully.",
    appointment,
  });
});

