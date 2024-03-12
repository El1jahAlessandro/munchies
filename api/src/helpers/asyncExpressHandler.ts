import _ from 'lodash';
import {ZodError} from 'zod';
import {RequestHandler} from "express";
import expressAsyncHandler from "express-async-handler";
import {getParseErrorMessage} from "./getParseErrorMessage";

export class StatusError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);

        Object.setPrototypeOf(this, StatusError.prototype);

        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
    }
}

type ResponseType<T> = T | { name?: string; message: string }

export function asyncExpressHandler<ResponseBody = unknown>(
    f: RequestHandler<undefined, ResponseType<ResponseBody>>
): RequestHandler<undefined, ResponseType<ResponseBody>> {
    if (!_.isFunction(f)) throw new Error(`Missing async HTTP handler function: ${f}`);

    return expressAsyncHandler<undefined, ResponseType<ResponseBody>>(async (req, res, next) => {
        try {
            await f(req, res, next)
        } catch (unknownError) {
            console.error(unknownError);
            let err;

            if (unknownError instanceof ZodError) {
                err = new Error(getParseErrorMessage(unknownError));
            } else if (unknownError instanceof Error) {
                err = unknownError;
            } else {
                console.error(
                    `Unexpected error type was thrown: ${typeof unknownError}. For more information visit: https://eslint.org/docs/rules/no-throw-literal`
                );
                if (_.isString(unknownError)) {
                    err = new Error(unknownError);
                } else {
                    err = new Error('internal server error');
                }
            }
            res.status(err instanceof StatusError ? err.statusCode : 400).send({
                name: err.name,
                message: err.message,
            })
        }
    })
}