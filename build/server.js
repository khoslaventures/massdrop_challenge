"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
// import routers
const JobRouter_1 = require("./router/JobRouter");
// Server class
class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        // set up mongoose
        const MONGO_URI = 'mongodb://localhost/tes';
        mongoose.connect(MONGO_URI || process.env.MONGO_URI);
        // config
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet());
        this.app.use(logger('dev'));
        this.app.use(compression());
        this.app.use(cors());
    }
    routes() {
        let router;
        router = express.Router();
        this.app.use('/', router);
        this.app.use('/api/v1/', JobRouter_1.default); // global endpoint
    }
}
// export
exports.default = new Server().app;
