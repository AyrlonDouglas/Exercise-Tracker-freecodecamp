const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("exercise", ExerciseSchema);
