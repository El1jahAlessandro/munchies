import _ from 'lodash';
import { ZodError } from 'zod';
import { getParseErrorMessage } from './getParseErrorMessage';
import { NextRequest, NextResponse } from 'next/server';

export class StatusError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);

        Object.setPrototypeOf(this, StatusError.prototype);

        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
    }
}

type ResponseType<T> = NextResponse<T> | NextResponse<{ error: string } | unknown>;

export function asyncNextHandler<ResBody = unknown>(
    fn: (request: NextRequest, response: NextResponse<ResBody>) => Promise<ResponseType<ResBody>>
) {
    return async function (req: NextRequest, res: NextResponse<ResBody>): Promise<ResponseType<ResBody>> {
        try {
            return await fn(req, res);
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

            return NextResponse.json(
                { error: err.message },
                { status: err instanceof StatusError ? err.statusCode : 400 }
            );
        }
    };
}
