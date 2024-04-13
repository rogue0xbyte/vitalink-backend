import express from "express";
import { Router } from "express";

import { readTodayaINRLevelByID } from '../../services/databasepg.mjs';
import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for checking user roles

const viewTodaysINRLevels = Router();

// Define a route to get today's INR levels for a patient for a doctor
viewTodaysINRLevels.get('/doctor/patient/todays-inr-levels/:patientId', async (req, res) => {
    const { patientId } = req.body;
    try {
        // Call function to retrieve today's INR levels for the patient
        const todaysINRLevels = await readTodayaINRLevelByID(patientId); // Assuming you have a function to get today's INR levels for a patient
        res.json(todaysINRLevels);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { viewTodaysINRLevels };
