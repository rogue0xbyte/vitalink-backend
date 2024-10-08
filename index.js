const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const crypto = require("crypto");
const http = require("http");

const app = express(); // Create Express app

// Middleware and configurations
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
    secret: "secret-key", 
    resave: false, 
    saveUninitialized: false,
    genid: generateSessionToken, // Use custom session ID generator
    // Fix session token initialization
    tokens: [],
    users: {}
}));

// Function to handle hashing
function hashPassword(password) {
    return crypto.createHash("sha512").update(password, 'utf-8').digest("hex");
}

function generateSessionToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Route for handling user login
app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (username.includes("PAT")) {
            const { readPatientByID } = await import('./services/databasepg.mjs');
            const patDeet = await readPatientByID(username);
            
            // Ensure patient details are retrieved successfully
            if (!patDeet) {
                return res.json({ message: "Invalid username" });
            }

            const contact = patDeet.contact.replace("+91", "").trim().replace(" ","");
            console.log(password);
            console.log(contact);

            if (password === contact) {
                const sessionToken = generateSessionToken();
                // Initialize session properties if not already initialized
                req.session.tokens = req.session.tokens || [];
                req.session.users = req.session.users || {};
                req.session.tokens.push(sessionToken);
                const User = patDeet;
                req.session.users[sessionToken] = { ...User, logged_in: true, patient: true, logged_in_as: "patient" };
                res.json({ message: 'Welcome pat', sessionToken: sessionToken });
            } else {
                res.json({ message: "Invalid password" });
            }
        } else if (username.includes("DOC")) {
            const { readDoctorByID } = await import('./services/databasepg.mjs');
            const docDeet = await readDoctorByID(username);
            
            // Ensure patient details are retrieved successfully
            if (!docDeet) {
                return res.json({ message: "Invalid username" });
            }

            const hashword = await hashPassword(password);
            console.log(docDeet.passhash);
            console.log(hashword);

            if (hashword === docDeet.passhash) {
                const sessionToken = generateSessionToken();
                // Initialize session properties if not already initialized
                req.session.tokens = req.session.tokens || [];
                req.session.users = req.session.users || {};
                req.session.tokens.push(sessionToken);
                const User = docDeet;
                req.session.users[sessionToken] = { ...User, logged_in: true, patient: true, logged_in_as: "patient" };
                res.json({ message: 'Welcome doc', sessionToken: sessionToken });
            } else {
                res.json({ message: "Invalid password" });
            }
        } else {
            res.json({ message: 'Invalid login' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

(async () => {
    const { patientDetail } = await import('./components/patient/details.mjs');
    app.use(patientDetail);
})();


(async () => {
    const { patientDosage } = await import('./components/patient/dosages.mjs');
    app.use(patientDosage);
})();

(async () => {
    const { takeDosage } = await import('./components/patient/takedose.mjs');
    app.use(takeDosage);
})();

(async () => {
    const { updateINR } = await import('./components/patient/updateinr.mjs');
    app.use(updateINR);
})();

(async () => {
    const { uploadReport } = await import('./components/patient/report.mjs');
    app.use(uploadReport);
})();

(async () => {
    const { reassignCaretaker } = await import('./components/doctor/reassign_caretaker.mjs');
    app.use(reassignCaretaker);
})();

(async () => {
    const { viewPatientDetail } = await import('./components/doctor/view_patient_detail.mjs');
    app.use(viewPatientDetail);
})();

(async () => {
    const { doctorPatientsList } = await import('./components/doctor/patient_list.mjs');
    app.use(doctorPatientsList);
})();

(async () => {
    const { doctorDosage } = await import('./components/doctor/view_dosage.mjs');
    app.use(doctorDosage);
})();

(async () => {
    const { viewINRLevels } = await import('./components/doctor/view_INR_Levels.mjs');
    app.use(viewINRLevels);
})();

(async () => {
    const { viewTodaysINRLevels } = await import('./components/doctor/view_today_INR_Levels.mjs');
    app.use(viewTodaysINRLevels);
})();

(async () => {
    const { addPatientRoute } = await import('./components/doctor/add_patient.mjs');
    app.use(addPatientRoute);
})();

(async () => {
    const { patINRFiles } = await import('./components/doctor/get_INR_file.mjs');
    app.use(patINRFiles);
})();

(async () => {
    const { updatePatDosage } = await import('./components/doctor/update_Dosage.mjs');
    app.use(updatePatDosage);
})();

(async () => {
    const { toggleTherapy } = await import('./components/doctor/toggleMed.mjs');
    app.use(toggleTherapy);
})();

(async () => {
    const { viewFile } = await import('./components/view_file.mjs');
    app.use(viewFile);
})();

// Start the server
const port = process.env.PORT || 4502;
const server = http.createServer(app);
server.listen(port, () => {
    console.log("Express.js app listening on port " + port);
});
