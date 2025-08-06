const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patientName: String,
  drugName: String,
  dosage: String,
  dateIssued: { type: Date, default: Date.now },
  status: { type: String, enum: ['issued', 'dispensed'], default: 'issued' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);