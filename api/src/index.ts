import express from 'express'
import allRouter from "./routers/_all.router";
import {RequestHandlerParams} from "express-serve-static-core";

const app = express()
const PORT = 6000

export class StatusError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
    }
}

const errorHandler: RequestHandlerParams = (error: StatusError, request, response, next) => {
    const {statusCode, message} = error
    response.status(statusCode).send({message, statusCode})
}

app.use(express.json())
app.use('/api', allRouter)
app.use(errorHandler)


app.listen(PORT, () =>
    console.log(`🚀 Server ready at: http://localhost:${PORT}`),
)