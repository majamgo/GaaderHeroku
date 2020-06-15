const express = require('express');
const router = express.Router();
const Bruger = require('../models/bruger.model');

// BASE ROUTE: /auth
// /auth/login og /auth/logout
// --------------------------------------------


// ----- LOGIN (tilføj session hvis match) ----
// ----- GET http://localhost:5050/auth/login--
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    // Find en bruger som matcher email - hvis der ikke er en, så throw error.
    // await: Den skal vente på databasen giver svar, før den executer andre funktioner.
    const bruger = await Bruger.findOne({ email: email });

    // Der blev IKKE fundet en bruger med email'en - afbryd yderligere kode.
    if(!bruger) {
        return res.status(401).json({ message: "Email findes ikke i systemet"}); // TODO: GDPR.
    }

    // Der blev fundet en bruger.
    bruger.comparePassword(password, function (err, isMatch) {

        // Enten gik det ikke så godt = err (error).
        if(err) {
            throw err;
        }

        // Eller det gik godt = der var et match på password (isMatch = true).
        if(isMatch)  {
            // SESSION el JWT her
            req.session.userId = bruger._id; // gem _id (mongoDB's id) på den bruger som matcher email+password.
            res.json({ brugernavn: bruger.brugernavn, brugerID: bruger._id });
        } else {
            // slet cookie - så en evt. tidligere succes bliver slettet når man forsøger at logge ind med forkert.
            res.status(401).json({ message: "Password matchede ikke"});
        }
    });
});


// ----- LOGUD (destroy session) ---------------
// ----- GET http://localhost:5050/auth/logout--
router.get('/logout', async (req, res) => {

    req.session.destroy(err => {
        if(err) return res.status(500).json({ message: "Logud lykkedes ikke - prøv igen" });

        // Slet cookie.
        res.clearCookie(process.env.SESS_NAME).status(200).json({ message: "Cookie er slettet" });
    });
});


// ----- LOGGET IND? true eller false ----------
// ----- GET http://localhost:5050/auth/loggedin
router.get('/loggedin', async (req, res) => {

    // Jeg gemmer userId i cookie - så derfor spørger jeg om den er der = logget ind.
    if(req.session.userId) {
        // Hvis der er logget ind.
        return res.status(200).json({ message: "Login er stadig aktivt" });
    } else {
        // Hvis der ikke er et login/en session.
        return res.status(401).json({ message: "Login eksisterer ikke eller er udløbet" });
    }
});


module.exports = router;