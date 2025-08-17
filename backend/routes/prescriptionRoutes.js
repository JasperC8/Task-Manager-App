const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const { protect } = require('../middleware/authMiddleware');
const { issuePrescription } = require('../controllers/prescriptionController');

// Doctor creates prescription (now uses controller for unit testing)
router.post('/issue', protect(['doctor']), issuePrescription);

// Doctor views their prescriptions
router.get('/mine', protect(['doctor']), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ issuedBy: req.user._id });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

// Doctor updates a prescription
router.put('/:id', protect(['doctor']), async (req, res) => {
  try {
    const updated = await Prescription.findOneAndUpdate(
      { _id: req.params.id, issuedBy: req.user._id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

// Doctor deletes a prescription
router.delete('/:id', protect(['doctor']), async (req, res) => {
  try {
    await Prescription.deleteOne({ _id: req.params.id, issuedBy: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

// Pharmacy views all prescriptions
router.get('/', protect(['pharmacy']), async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

// Pharmacy marks prescription as dispensed
router.put('/:id/dispense', protect(['pharmacy']), async (req, res) => {
  try {
    const updated = await Prescription.findByIdAndUpdate(
      req.params.id,
      { isDispensed: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

module.exports = router;
