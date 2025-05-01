require('dotenv').config();
const express = require('express');
const mysql = require("mysql2");
const router = require('./routes/index');
const path = require('path');

const SERVER_PORT = process.env.SERVER_PORT;
const app = express();
const cookieParser = require('cookie-parser');


//v1
const cors = require('cors');
const corsOptions = {
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true, // This is important.
    origin: "https://lagg333673034-my-test-app.netlify.app",
    //origin: "http://localhost:3000",
};
app.use(cors(corsOptions));


//v2
/*app.use(function(req, res, next) {
    //const allowedOrigins = ['http://localhost:3000/', 'https://localhost:3000/'];
    const allowedOrigins = ['http://lagg333673034-my-test-app.netlify.app/', 'https://lagg333673034-my-test-app.netlify.app/'];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});*/



app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/', router);

const start = async () => {
    try{
        app.listen(SERVER_PORT, () => {
            console.log(`Server started on port ${SERVER_PORT}`)
        });
    }catch(e){
        console.log(e);
    }
};
start();

//const job = require('./cron');
//job.start();
