const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');
const { issuePrescription } = require('../controllers/prescriptionController');

const { expect } = chai;

describe('Prescription Controller - issuePrescription', () => {
  afterEach(() => sinon.restore());

  it('should create a prescription successfully', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        patientName: 'Alice',
        medication: 'Amoxicillin',
        dosage: '500mg',
        instructions: 'Twice daily'
      }
    };

    const created = { _id: new mongoose.Types.ObjectId(), ...req.body, issuedBy: req.user._id };
    const createStub = sinon.stub(Prescription, 'create').resolves(created);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await issuePrescription(req, res);

    expect(createStub.calledOnceWith({
      patientName: 'Alice',
      medication: 'Amoxicillin',
      dosage: '500mg',
      instructions: 'Twice daily',
      issuedBy: req.user._id
    })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(created)).to.be.true;
  });

  it('should return 500 if DB error occurs', async () => {
    sinon.stub(Prescription, 'create').throws(new Error('DB Error'));

    const req = { user: { _id: new mongoose.Types.ObjectId() }, body: { patientName: 'Bob' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await issuePrescription(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});
