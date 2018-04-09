"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Job_1 = require("../models/Job");
const rp = require("request-promise");
const validate = require("validate.js");
class JobRouter {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    GetJobs(req, res) {
        Job_1.default.find({})
            .then((data) => {
            const status = res.statusCode;
            res.json({
                status,
                data
            });
        })
            .catch((error) => {
            const status = res.statusCode;
            res.json({
                status,
                error
            });
        });
    }
    CreateJob(req, res) {
        const jobURL = req.body.url;
        const job = new Job_1.default({
            url: jobURL,
            content: '',
            status: 'In Progress',
        });
        job.save()
            .then((data) => {
            const status = res.statusCode;
            res.json({
                status,
                data
            });
        })
            .catch((error) => {
            const status = res.statusCode;
            res.json({
                status,
                error
            });
        });
        validate({ website: jobURL }, { website: { url: true } });
        rp(jobURL)
            .then((html) => {
            const statusMsg = "Job is complete";
            Job_1.default.findByIdAndUpdate(job._id, {
                url: jobURL,
                content: html,
                status: statusMsg,
            }).then((test) => {
                console.log(test);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            const statusMsg = "Job has failed";
            Job_1.default.findByIdAndUpdate(job._id, {
                url: jobURL,
                content: err.message,
                status: statusMsg,
            });
            console.log("URL is unavailable", err.message);
        });
    }
    GetJob(req, res) {
        const id = req.params.id;
        Job_1.default.findById(id)
            .then((data) => {
            const status = res.statusCode;
            res.json({
                status,
                data
            });
        })
            .catch((error) => {
            const status = res.statusCode;
            res.json({
                status,
                error
            });
        });
    }
    // public UpdateJob(req: Request, res: Response): void {
    // }
    DeleteJob(req, res) {
        const id = req.params.id;
        Job_1.default.findByIdAndRemove(id)
            .then((data) => {
            const status = res.statusCode;
            res.json({
                status,
                data
            });
        })
            .catch((error) => {
            const status = res.statusCode;
            res.json({
                status,
                error
            });
        });
    }
    routes() {
        // url
        this.router.get("/", this.GetJobs);
        this.router.post("/url", this.CreateJob);
        // id
        this.router.get("/:id", this.GetJob);
        // this.router.put("/:id", this.UpdateJob);
        this.router.delete("/:id", this.DeleteJob);
    }
}
// export
const postRoutes = new JobRouter();
postRoutes.routes();
const router = postRoutes.router;
exports.default = router;
