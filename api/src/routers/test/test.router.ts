import express from "express";
import {greeting} from "./greeting";

const testRouter = express.Router()

testRouter.get('/greeting', greeting)

export default testRouter