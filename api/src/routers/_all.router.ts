import express from "express";
import testRouter from "./test/test.router";

const allRouter = express.Router()
allRouter.use('/test', testRouter)
export default allRouter