import { Router, Request, Response, NextFunction } from 'express';
import Job from '../models/Job';
import * as rp from "request-promise";
import * as validate from "validate.js";

class JobRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetJobs(req: Request, res: Response): void {
        Job.find({})
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
        })
    }

    public CreateJob(req: Request, res: Response): void {
        const jobURL: string = req.body.url;
        const job = new Job({
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
        })
                
        let invalidURL = validate({website: jobURL}, {website: {url: true}})
        if (invalidURL) {
            const statusMsg = "Job has failed: Invalid URL";
            Job.findByIdAndUpdate(job._id, {
                url: jobURL,
                content: '',
                status: statusMsg,
            });
        } else {
            rp(jobURL)
            .then((html) => {
                const statusMsg = "Job is complete";
                Job.findByIdAndUpdate(job._id, {
                    url: jobURL,
                    content: html,
                    status: statusMsg,
            }).catch((err) => {
                const statusMsg = "Job has failed: URL is unavailable";
                Job.findByIdAndUpdate(job._id, {
                    url: jobURL,
                    content: err.message,
                    status: statusMsg,
                });
                console.log("URL is unavailable", err.message);
            })
            })
        }
    }

    public GetJob(req: Request, res: Response): void {
        const id: string = req.params.id;

        Job.findById(id)
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
        })
    }

    public UpdateJob(req: Request, res: Response): void {
        const id: string = req.params.id;
        const newURL: string = req.body.url;
        
        Job.findByIdAndUpdate(id, {
            url: newURL,
            content: '',
            status: 'In Progress',
        }, {new: true})
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
        })
                
        let invalidURL = validate({website: newURL}, {website: {url: true}})
        if (invalidURL) {
            const statusMsg = "Job has failed: Invalid URL";
            Job.findByIdAndUpdate(id, {
                url: newURL,
                content: '',
                status: statusMsg,
            });
        } else {
            rp(newURL)
            .then((html) => {
                const statusMsg = "Job is complete";
                Job.findByIdAndUpdate(id, {
                    url: newURL,
                    content: html,
                    status: statusMsg,
            }).catch((err) => {
                const statusMsg = "Job has failed: URL is unavailable";
                Job.findByIdAndUpdate(id, {
                    url: newURL,
                    content: err.message,
                    status: statusMsg,
                });
                console.log("URL is unavailable", err.message);
            })
            })
        }
    }

    public DeleteJob(req: Request, res: Response): void {
        const id: string = req.params.id;

        Job.findByIdAndRemove(id)
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
        })
    }

    public DeleteJobs(req: Request, res: Response): void {
        Job.remove({})
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
        })
    }

    routes() {
        // url
        this.router.get("/", this.GetJobs);
        this.router.post("/url", this.CreateJob);
        this.router.delete("/", this.DeleteJobs)

        // id
        this.router.get("/:id", this.GetJob);
        this.router.put("/:id", this.UpdateJob);
        this.router.delete("/:id", this.DeleteJob);
    }
}

// export
const postRoutes = new JobRouter();
postRoutes.routes();
const router = postRoutes.router;

export default router;