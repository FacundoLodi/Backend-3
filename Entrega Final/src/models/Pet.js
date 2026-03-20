import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specie: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  adopted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Pet", petSchema);