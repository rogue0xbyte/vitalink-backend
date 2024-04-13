import express from "express";
import { Router } from "express";

import { getINRFile } from '../../services/databasepg.mjs';
import { authenticateToken } from '../../services/middlewares.mjs';

const patINRFiles = Router();

// Define a route to get the INR files of a patient for a doctor
patINRFiles.get('/doctor/patient/inr-files/:patientId', async (req, res) => {
    const { patientId } = req.params;
    try {
        // Call function to retrieve the INR files for the patient
        const inrFiles = await getINRFile(patientId); // Assuming you have a function to get INR files for a patient
        res.json(inrFiles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { patINRFiles };
