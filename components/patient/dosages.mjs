import { readDosageByID, getMissedDosages, getMonthlyAverageDosages } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs';

const patientDosage = Router();

// Define a new route to get patient details
patientDosage.get('/patient/dosage', authenticateToken, async (req, res) => {
    const sessionToken = req.token;
    try{
        // Check if session token exists in session tokens
        if (req.session.tokens.includes(sessionToken)) {
            try {
                // Retrieve patient details from session
                const patientDetails = req.session.users[sessionToken];
                const patientId = patientDetails.id;
                const patientDosages = await readDosageByID(patientId);
                const missedDosages = await getMissedDosages(patientId);
                const monthlyAvg = await getMonthlyAverageDosages(patientId);
                res.json({dosages: patientDosages, missed: missedDosages, monthlyAvg: monthlyAvg});
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error'});
            }
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error'});
    }
});

export { patientDosage };