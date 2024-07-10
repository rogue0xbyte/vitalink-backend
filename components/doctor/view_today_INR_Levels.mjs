import express from "express";
import { Router } from "express";

import { readTodayINRLevels } from '../../services/databasepg.mjs';
import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for checking user roles

const viewTodaysINRLevels = Router();

// Define a route to get today's INR levels for a doctor
viewTodaysINRLevels.get('/doctor/todays-inr-levels', authenticateToken, async (req, res) => {
    const sessionToken = req.token;
    try {
        if (req.session.tokens.includes(sessionToken)) {
            try {
                // Retrieve doctor details from session
                const doctorDetails = req.session.users[sessionToken];
                const doctorId = doctorDetails.id;
                const today_Levels = await readTodayINRLevels(doctorId);
                res.json(today_Levels);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error'});
            }
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { viewTodaysINRLevels };
