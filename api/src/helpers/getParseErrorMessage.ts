import {z} from "zod";

export const getParseErrorMessage = (error: z.ZodError) => {
    return error.errors.map(err => `${err.path.join(' > ')} ${err.message}`).join('; ')
}