const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientName: String,
  medication: String,
  dosage: String,
  instructions: String,
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDispensed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
