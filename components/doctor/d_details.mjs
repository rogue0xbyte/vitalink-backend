import { readDoctorByID } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs';

const DoctorDetail = Router();

// Define a new route to get doctor details
doctorDetail.get('/doctor/details', authenticateToken, async (req, res) => {
    const sessionToken = req.token;
    try{
        // Check if session token exists in session tokens
        if (req.session.tokens.includes(sessionToken)) {
            try {
                // Retrieve doctor details from session
                const doctorDetails = req.session.users[sessionToken];
                const doctorId = doctorDetails.id;
                const doctorDetailsFromDB = await readDoctorByID(doctorId);
                res.json(doctorDetailsFromDB);
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

export { doctorDetail };