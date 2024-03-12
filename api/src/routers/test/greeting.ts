import {z} from "zod";
import {getZodParams} from "../../helpers/getZodParams";
import {asyncExpressHandler, StatusError} from "../../helpers/asyncExpressHandler";

const queriesSchema = z.object({
    name: z.string(getZodParams("string")),
    age: z.preprocess(value => value ? Number(value) : value, z.number(getZodParams("number"))),
})

export const greeting = asyncExpressHandler<string>(
    async ({query: unknownQueries}, res) => {
        const {name, age} = queriesSchema.parse(unknownQueries)
        if (age < 18) {
            throw new StatusError(401, "You are under 18, you are not authorized")
        }
        res.status(200).json(`Hello ${name}, you are ${age} years old`)
    }
)