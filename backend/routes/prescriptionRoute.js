const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const { protect } = require('../middleware/authMiddleware');

// Doctor creates prescription
router.post('/issue', protect(['doctor']), async (req, res) => {
  const { patientName, medication, dosage, instructions } = req.body;
  try {
    const prescription = new Prescription({
      patientName,
      medication,
      dosage,
      instructions,
      issuedBy: req.user._id
    });
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Doctor views their prescriptions
router.get('/mine', protect(['doctor']), async (req, res) => {
  const prescriptions = await Prescription.find({ issuedBy: req.user._id });
  res.json(prescriptions);
});

// Doctor updates a prescription
router.put('/:id', protect(['doctor']), async (req, res) => {
  const updated = await Prescription.findOneAndUpdate(
    { _id: req.params.id, issuedBy: req.user._id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Doctor deletes a prescription
router.delete('/:id', protect(['doctor']), async (req, res) => {
  await Prescription.deleteOne({ _id: req.params.id, issuedBy: req.user._id });
  res.json({ message: 'Deleted' });
});

// Pharmacy views all prescriptions
router.get('/', protect(['pharmacy']), async (req, res) => {
  const prescriptions = await Prescription.find();
  res.json(prescriptions);
});

// Pharmacy marks prescription as dispensed
router.put('/:id/dispense', protect(['pharmacy']), async (req, res) => {
  const updated = await Prescription.findByIdAndUpdate(req.params.id, { isDispensed: true }, { new: true });
  res.json(updated);
});

module.exports = router;