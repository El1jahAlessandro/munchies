import express from "express";
import testRouter from "./test/test.router";
import userRouter from "./user/user.router";

const allRouter = express.Router()
allRouter.use('/test', testRouter)
allRouter.use('/user', userRouter)
export default allRouter