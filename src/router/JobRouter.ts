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
                
        validate({website: jobURL}, {website: {url: true}});
        rp(jobURL)
        .then((html) => {
            const statusMsg = "Job is complete";
            Job.findByIdAndUpdate(job._id, {
                url: jobURL,
                content: html,
                status: statusMsg,
            }).then((test) => {
                console.log(test)
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            const statusMsg = "Job has failed";
            Job.findByIdAndUpdate(job._id, {
                url: jobURL,
                content: err.message,
                status: statusMsg,
            });
            console.log("URL is unavailable", err.message);
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

    // public UpdateJob(req: Request, res: Response): void {

    // }

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

export default router;