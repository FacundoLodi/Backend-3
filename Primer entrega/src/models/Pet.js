import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: String,
  specie: String,
  birthDate: Date
});

export default mongoose.model("Pet", petSchema);