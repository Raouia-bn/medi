import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "aName must cotain at least 3 characters."],
    maxLength: [30, "Name cannot exceed 30 characters."],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide valid email."],
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
 
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must cantain at least 8 chatacters."],
    maxLength: [32, "Password cannot exceed 32 characters."],
    select: false
  },
  specialty: {
    type: String,
    required: false,  },


  experience: {
    type: Number,
    required: false,
  },
  priceConsultation: {
    type: Number,
    required:false,
    
  },
  availability: {
    type: String,
    required:false,
    
  },

  birthday:{
    type:String,
    required:false,

  },

  Insurancenumber:{
    type: String ,

    required: false,
 },
 payment:{
  type: [String],
  required:false,

 },

 opening:{
  type:String,
  required:false,

 },
 vehicle:{
  type :String,
  required:false,

 },
 availability:{
  type :Boolean,
  required:false,

 },
 coverarea:{
  type:String,
  required:false,
},
  role: {
    type: String,
    required: true,
    enum: ["Doctor","Patient","Delivery","Pharmacy"],
  },
  //pour le médcin
  unavailableDays: [
    {
      date: {
        type: Date,
        required: false,
      },
      startTime: {
        type: String,  // Utilisez String pour représenter les heures dans le format "HH:mm"
        required: false,
      },
      endTime: {
        type: String,  // Pareil pour l'heure de fin
        required: false,
      },
      reason: {
        type: String,
        required: false,
      },
    },
  ],
  
});
userSchema.virtual("commandes", {
  ref: "Commande",
  localField: "_id",
  foreignField: "user",
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);