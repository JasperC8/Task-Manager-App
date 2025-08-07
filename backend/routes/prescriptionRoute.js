const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const authMiddleware = require('../middleware/authMiddleware');

// CREATE
router.post('/issue', authMiddleware(['doctor']), async (req, res) => {
  try {
    const prescription = await Prescription.create({
      ...req.body,
      doctor: req.user._id
    });
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all (for pharmacy)
router.get('/', authMiddleware(['pharmacy']), async (req, res) => {
  const prescriptions = await Prescription.find({ status: 'issued' });
  res.json(prescriptions);
});

// READ mine (for doctor)
router.get('/mine', authMiddleware(['doctor']), async (req, res) => {
  const prescriptions = await Prescription.find({ doctor: req.user._id });
  res.json(prescriptions);
});

// UPDATE by doctor
router.put('/:id', authMiddleware(['doctor']), async (req, res) => {
  const updated = await Prescription.findOneAndUpdate(
    { _id: req.params.id, doctor: req.user._id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// MARK AS DISPENSED (pharmacy)
router.put('/:id/dispense', authMiddleware(['pharmacy']), async (req, res) => {
  const updated = await Prescription.findByIdAndUpdate(
    req.params.id,
    { status: 'dispensed' },
    { new: true }
  );
  res.json(updated);
});

// DELETE by doctor
router.delete('/:id', authMiddleware(['doctor']), async (req, res) => {
  await Prescription.findOneAndDelete({ _id: req.params.id, doctor: req.user._id });
  res.json({ message: 'Deleted' });
});

module.exports = router;