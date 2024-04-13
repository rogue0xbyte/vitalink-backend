import { readPatientByID, readDosageByID } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for checking user roles

const doctorDosage = Router();

// Define a route to get prescriptions for a patient for a doctor
doctorDosage.get('/doctor/patient/prescription/:patientId', async (req, res) => {
    const { patientId } = req.body;
    try {
        // Call function to retrieve prescriptions for the patient
        const dosage = await readDosageByID(patientId); // Assuming you have a function to get prescriptions for a patient
        res.json(dosage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { doctorDosage };
