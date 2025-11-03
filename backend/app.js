require('dotenv').config();
require('express-async-errors');

// extra security packages
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const artRouter = require('./routes/art');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));

app.use(express.json());
app.use(helmet({
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = [
    'http://localhost:8600',
    'http://localhost:3000',
    // Ensure this env var is correctly set to your production frontend URL
    process.env.FRONTEND_URL
];
app.use(cors({
  origin:(origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        // AND origins that are explicitly allowed.
        if (!origin || allowedOrigins.includes(origin)) {
            console.log(`Bypassed CORS request from origin: ${origin}`);
            callback(null, true);
        } else {
            // Log the blocked origin for debugging
            console.log(`Blocked CORS request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(xss());

console.log('CORS enabled for ' + process.env.FRONTEND_URL)


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use('/api/v1/art', artRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8300;

const start = async () => {
  try {
    //choose the correct database based on environment
    let mongoURL = process.env.MONGO_URI;
    if (process.env.NODE_ENV === "test") {
      mongoURL = process.env.MONGO_URI_TEST;
    } 
   //connect to database
    await connectDB(mongoURL);
   //start the server
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
