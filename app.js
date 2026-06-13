require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth-routes');
const noteRoutes = require('./routes/note-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

//Handling cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
})

app.use('/api/auth', authRoutes);

app.use('/api/notes', noteRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!'});
})

mongoose
    .connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-4czkrge-shard-00-00.kmmjqbo.mongodb.net:27017,ac-4czkrge-shard-00-01.kmmjqbo.mongodb.net:27017,ac-4czkrge-shard-00-02.kmmjqbo.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-l5z2j0-shard-0&authSource=admin&appName=Cluster0`)
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log('Server running on port 5000');
        });
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    })

