export const getZodParams = (expectedType: ("string" | "number" | "boolean" | "object" | "array")) => {
    return {invalid_type_error: `is not a ${expectedType}`, required_error: `is not provided`}
}