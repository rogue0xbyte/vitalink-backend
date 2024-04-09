import { readPatientByID } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs';

const patientDetail = Router();

// Define a new route to get patient details
patientDetail.get('/details', authenticateToken, async (req, res) => {
    const sessionToken = req.token;
    try{
        // Check if session token exists in session tokens
        if (req.session.tokens.includes(sessionToken)) {
            try {
                // Retrieve patient details from session
                const patientDetails = req.session.users[sessionToken];
                const patientId = patientDetails.id;
                const patientDetailsFromDB = await readPatientByID(patientId);
                res.json(patientDetailsFromDB);
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

export { patientDetail };