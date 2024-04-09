import { readPatientByID, updatePatientCaretaker } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken, checkUserRole } from '../../services/middlewares.mjs'; // Assuming you have a middleware for checking user roles

const patientDetail = Router();

// Define a new route to get patient details
patientDetail.get('/patient/details', authenticateToken, async (req, res) => {
    const sessionToken = req.token;
    try {
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
                res.status(500).json({ message: 'Internal Server Error' });
            }
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Define a route to reassign a caretaker
patientDetail.put('/patient/reassign-caretaker', authenticateToken, checkUserRole('doctor'), async (req, res) => {
    const { patientId, newCaretakerId } = req.body; // Assuming patientId and newCaretakerId are provided in the request body
    try {
        // Call function to update caretaker in the database
        await updatePatientCaretaker(patientId, newCaretakerId);
        res.status(200).json({ message: 'Caretaker reassigned successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { reassignCaretaker };
