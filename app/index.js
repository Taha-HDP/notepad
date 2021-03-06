const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const winston = require("winston");
const morgan = require('morgan');
const ErrorMiddleware = require("./http/middleware/error");
const api = require("./routes/api");
require("express-async-errors");
require("winston-mongodb");
class Application {
    constructor() {
        this.setup_express();
        this.setup_routesAndMidleware();
        this.setup_database();
        this.setup_error_handling();
    }
    setup_routesAndMidleware() {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static("public"));
        if (app.get('env') === 'production') app.use(morgan('tiny'));
        app.use(cors());
        app.use("/api", api);
        app.use(ErrorMiddleware);
    }
    setup_error_handling() {
        winston.add(new winston.transports.File({
            filename: "error_logs.log",
            level: "error"
        }),
        );
        process.on('uncaughtException', (err) => {
            console.log(err);
            winston.error(err.message);
        });
        process.on('unhandledRejection', (err) => {
            console.log(err);
            winston.error(err.message);
        });
    }
    setup_database() {
        mongoose.connect("mongodb://localhost:27017/NotePad", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => { 
            console.log("db connected");
        }).catch((err) => {
            console.log("db not connected", err);
        })
    }
    setup_express() {
        const port = process.env.myPort || 3000;
        app.listen(port, () => {
            console.log(`app listening on port ${port}`)
          })
    }
}

module.exports = Application;