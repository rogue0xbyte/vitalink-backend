import { readPatientByID } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs';

const router = Router();

// Define a new route to get patient details
router.get('/details', authenticateToken, async (req, res) => {
    const sessionToken = req.token;

    // Check if session token exists in session tokens
    if (session.tokens.includes(sessionToken)) {
        try {
            // Retrieve patient details from session
            const patientDetails = JSON.parse(session.users[sessionToken]);
            const patientId = patientDetails.get("id");
            const patientDetailsFromDB = await readPatientByID(patientId);
            res.json(patientDetailsFromDB);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
});