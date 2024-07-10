import { readPatientByID } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for checking user roles

const viewPatientDetail = Router();

// Define a route to get a single patient's details for doctors
viewPatientDetail.get('/doctor/patient/details/:patientId', async (req, res) => {
    const { patientId } = req.body;
    try {
        // Call function to retrieve patient details from the database
        const patientDetails = await readPatientByID(patientId);
        if (patientDetails) {
            res.json(patientDetails);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { viewPatientDetail };