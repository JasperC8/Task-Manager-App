const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  drugName: { type: String, required: true },
  dosage: { type: String, required: true },
  status: { type: String, default: 'issued' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);