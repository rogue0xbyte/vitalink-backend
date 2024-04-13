import express from "express";
import { Router } from "express";
import { readINRLevelByID } from '../../services/databasepg.mjs';
import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for checking user roles

const viewINRLevels = Router();

// Define a route to get INR levels for a patient for a doctor
viewINRLevels.get('/doctor/patient/inr-levels/:patientId',async (req, res) => {
    const { patientId } = req.body;
    try {
        // Call function to retrieve INR levels for the patient
        const inrLevels = await readINRLevelByID(patientId); // Assuming you have a function to get INR levels for a patient
        res.json(inrLevels);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { viewINRLevels };
