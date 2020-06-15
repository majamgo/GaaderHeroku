require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);

const app = express();
const PORT = process.env.PORT;


// Mongoose og DB  -----------------------------------------------------------------------------
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to Database'));


// APP  ----------------------------------------------------------------------------------------
app.use(cors(/*{ credential: true, origin: true }*/));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// SESSION  ------------------------------------------------------------------------------------
const TWO_HOURS = 1000 * 60 * 60 * 2

const {
    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh!quiet,it\'asecret!',
    SESS_LIFETIME = TWO_HOURS
} = process.env

app.use(session({
    name: SESS_NAME,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db }),
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true, // 'strict'
        secure: false
    }
}));


// ROUTES  -------------------------------------------------------------------------------------


// INDEX  --------------------------------------------------------------------------------------
app.get('/', async (req, res) => {
    res.send("Velkommen til serveren!");
});


// AUTHORIZATION - ADGANG TIL ADMIN  ----------------------------------------------------------
app.use('*/admin*', (req, res, next) => {

    // Hvis ikke logget ind - returnér brugeren med en fejl
    if(!req.session.userId) {
        return res.status(401).json({ message: "Du har ikke adgang!" });
    }

    next(); // Hvis logget ind - så bare fortsæt arbejdet = next!
});


// GAADER  -------------------------------------------------------------------------------------
const gaadeRouter = require('./routes/gaader.routes');
app.use('/gaader', gaadeRouter);


// BRUGER  -------------------------------------------------------------------------------------
const brugerRouter = require('./routes/bruger.routes');
app.use('/admin/bruger', brugerRouter);


// AUTH
const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);


//  --------------------------------------------------------------------------------------------
app.listen(PORT, () => console.log('Server started - lytter på port ' + PORT));