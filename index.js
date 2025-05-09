require('dotenv').config();
const express = require('express');
const router = require('./routes/index');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/error');

const CORS_ORIGIN = process.env.CORS_ORIGIN;
const CORS_ORIGIN1 = process.env.CORS_ORIGIN1;
const SERVER_PORT = process.env.SERVER_PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

//v1
/*const cors = require('cors');
const corsOptions = {
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true, // This is important.
    //origin: "https://lagg333673034-my-test-app.netlify.app",
    //origin: "http://localhost:3000",
    origin: CORS_ORIGIN,
};
app.use(cors(corsOptions));
*/
//v2
app.use(function(req, res, next) {
    //const allowedOrigins = ['http://localhost:3000','https://lagg333673034-my-test-app.netlify.app'];
    const allowedOrigins = [`${CORS_ORIGIN}`];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.setHeader("Cross-Origin-Opener-Policy", origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE, PATCH");
    next();
});

app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/', router);
app.use(errorMiddleware);

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