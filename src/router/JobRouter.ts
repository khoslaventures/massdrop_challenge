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
        .then((job) => {
            const status = res.statusCode;
            res.json({
                status,
                job
            });
            console.log("Responded")
            return job
        }).catch((err) => {
            const status = res.statusCode;
            res.json({
                status,
                err
            });
            console.log("Responded")
        }).
        then((job) => {
            // validate error catching
            validate({website: job.url}, {website: {url: true}})
            rp(job.url)
            .then((html) => {
                const statusMsg = "Job is complete";
                job.content = html;
                job.status = statusMsg;
                job.save();
                console.log(job.id, "is complete.")
            }).catch((err) => {
                const statusMsg = "Job has failed: URL is unavailable";
                job.content = err.message,
                job.status = statusMsg,
                job.save();
                console.log("URL is unavailable", err.message);
            })
        }).catch((err) => {
            const statusMsg = "Job has failed: Invalid URL";
            job.content = err.message,
            job.status = statusMsg,
            job.save();
            console.log("Invalid URL", err.message)
        })
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