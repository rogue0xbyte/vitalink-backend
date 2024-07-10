import { readPatientByID, updatePatientCaretaker } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for checking user roles

const reassignCaretaker = Router();

// Define a route to reassign a caretaker
reassignCaretaker.put('/doctor/reassign-caretaker', authenticateToken, async (req, res) => {
    const { patientId, newCareTakerId } = req.body; // Assuming patientId and newCaretakerId are provided in the request body
    try {
        // Call function to update caretaker in the database
        await updatePatientCaretaker(patientId, newCareTakerId);
        res.status(200).json({ message: 'Caretaker reassigned successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { reassignCaretaker };
