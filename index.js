const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Pool } = require("pg");
const crypto = require("crypto");
const http = require("http");
const path = require('path');


const app = express(); //One for GET POST OPUT GEDIT

app.use(cors());
app.use(express.json());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: false }));

// Middleware to authenticate bearer token
function authenticateToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        // If no bearer token provided
        res.status(401).json({'message': 'Unauthorized'});
    }
}

const server = http.createServer(app);
dotenv.config();

// Database connection setup
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

// Function to handle hashing
function hashPassword(password) {
  return crypto.createHash("sha512").update(password).digest("hex");
}

function generateSessionToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

if (!session.tokens) {
    session.tokens = []; // Initialize session tokens array if it's not already defined
}

if (!session.users) {
    session.users = {}; // Initialize session users object if it's not already defined
}

const port = process.env.PORT || 4502;

try
{
    app.get("/", ((req, res)=>{
    const { login, password } = req.body;
    console.log(login, password);
    res.json({details: "Welcome to the project"}); //response should always be at the last as the sesssion will be done
    })) //Just like flask we give a path then what is the method next is used in middleware
}catch(err)
{
    console.log(err);
}

// Route for handling user login
app.route("/login").all(async (req, res) => {
  if (req.method === "POST") {
    const username = req.body.username;
    const password = req.body.password;

    try {

        const client = await pool.connect();

        if (username.includes("PAT")) {
            const pat_data = await client.query("SELECT * FROM patients WHERE id = $1", [username]);
            let mypass = pat_data.rows[0].contact.replace("+91", "").split(" ")[1].trim();
            mypass = hashPassword(mypass);
            if (mypass === hashPassword(password)) {
                const sessionToken = generateSessionToken();
                session.tokens.push(sessionToken);
                const User = pat_data;
                session.users[sessionToken] = JSON.stringify(User);
                session.users[sessionToken].logged_in = true;
                session.users[sessionToken].patient = true;
                session.users[sessionToken].logged_in_as = "patient";
                res.json({'message':'welcome pat', 'sessionToken': sessionToken})
            } else {
                res.json({"message":"invalid password"})
            }
        } else {
            res.json({'message':'invalid login'})
        }
    } catch (error) {
        console.error("Error:", error);
        res.json({'message':'error 500'})
    }
  } else {
    res.sendFile(path.join(__dirname, "templates/generic/login.html"));
  }
});

// Define a new route to get patient details
app.get('/patient/details', authenticateToken, (req, res) => {
    const sessionToken = req.token;

    // Check if session token exists in session tokens
    if (session.tokens.includes(sessionToken)) {
        // Retrieve patient details from session
        const patientDetails = JSON.parse(session.users[sessionToken]);
        res.json(patientDetails.rows[0]);
    } else {
        res.status(403).json({'message': 'Forbidden'});
    }
});

app.listen(port, function(){
    console.log("Express.js app listening on port " + port);
})