import { config } from 'dotenv';
config();

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from 'cors';
import * as admin from "firebase-admin";
import firebaseCreds from './firebase-creds.json';

const serviceAccount = firebaseCreds as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

import routes from "./app/routes";
import { isDev, PORT, ALLOWED_ORIGINS } from './config';

const app = express();
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (isDev) {
    app.use(cors());
} else {
    app.use((req, res, next) => {
        const { origin } = req.headers;
        if (ALLOWED_ORIGINS.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, cookie');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
}


app.get("/info", (req, res) => {
  res.send("Welcome to Saravana Lakshmi server");
});

app.use(routes);

app.listen(PORT, () => {
    console.log(`listening on: http://localhost:${PORT}`);
});
