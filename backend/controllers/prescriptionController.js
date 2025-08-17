const Prescription = require('../models/Prescription');

async function issuePrescription(req, res) {
  try {
    const payload = {
      patientName: req.body.patientName,
      medication: req.body.medication,
      dosage: req.body.dosage,
      instructions: req.body.instructions,
      issuedBy: req.user?._id, // set by auth middleware
    };
    const created = await Prescription.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

module.exports = { issuePrescription };
