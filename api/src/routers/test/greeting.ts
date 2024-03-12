import {z} from "zod";
import {getZodParams} from "../../helpers/getZodParams";
import {RequestHandler} from "express";
import {getParseErrorMessage} from "../../helpers/getParseErrorMessage";
import {StatusError} from "../../index";

const queriesSchema = z.object({
    name: z.string(getZodParams("string")),
    age: z.preprocess(value => value ? Number(value) : value, z.number(getZodParams("number"))),
})

export const greeting: RequestHandler = async ({query: unknownQueries}, res, next) => {
    try {
        const parsedQueries = queriesSchema.safeParse(unknownQueries)
        if (parsedQueries.success) {
            const {name, age} = parsedQueries.data
            res.status(200).json(`Hello ${name}, you are ${age} years old`)
        } else {
            throw new StatusError(500, getParseErrorMessage(parsedQueries.error))
        }
    } catch (e) {
        next(e)
    }
}