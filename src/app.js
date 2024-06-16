import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import {errorMiddleware} from './middleware/index.js';
import db from './models/index.js';
import routes from './routes/index.js';

const app = express();

// --- CORS ---//
const corsOptions = {
    origin: '*',
    credentials: true
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- Routes ---//
const base_api = '/api/v1';
routes(app, base_api);

// Error Middleware
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Connecting to database...`);

    // connect to database
    await db.sequelize.authenticate()
        .then(async () => {
            console.log(`\n\t Connected to ${process.env.DB_NAME} database...`);

            // sync database
            await db.sequelize.sync({ alter: true })
                .then(() => {
                    console.log(`\n\t models synchronized successfully\n`)
                })
                .catch((error) => {
                    console.error('Error syncing database models ', error);
                });
        })
        .catch((error) => {
            console.log(`\n\t Failed to connect to ${process.env.DB_NAME} database! \n\n\t`, error.original, '\n')
        })
});
