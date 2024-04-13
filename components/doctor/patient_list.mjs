import { readDoctorPatients, readPatientByID } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for checking user roles

const doctorPatientsList = Router();

// Define a route to get the list of patients for a doctor
doctorPatientsList.get('/doctor/patients', async (req, res) => {
    const { doctorId } = req.body;
    try {
        // Call function to retrieve all patients for the logged-in doctor
        const patients = await readDoctorPatients(doctorId); // Assuming you have a function to get all patients for a doctor
        res.json(patients);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { doctorPatientsList };
