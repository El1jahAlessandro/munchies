import express from 'express'
import allRouter from "./routers/_all.router";
import * as dotenv from 'dotenv';

dotenv.config({path: '../api/.env', debug: true});

const app = express()
const port = process.env.PORT

if (port) {
    app.use(express.json())
    app.use('/api', allRouter)

    app.listen(port, () =>
        console.log(`🚀 Server ready at: http://localhost:${port}`),
    )
} else {
    console.error("\x1b[31m", '!!!--- Port is not defined ---!!!')
}