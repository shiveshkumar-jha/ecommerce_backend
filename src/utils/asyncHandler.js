//asyncHandler is a higher-order function that takes a function fn as an argument and returns an asynchronous function that handles errors for that function. It is used to wrap asynchronous route handlers in Express.js applications, allowing for centralized error handling. The returned function takes three parameters: req (the request object), res (the response object), and next (a callback function to pass control to the next middleware). Inside the returned function, it uses a try-catch block to execute the provided fn function with the req, res, and next parameters. If an error occurs during the execution of fn, it catches the error and sends a response with the error code (or 500 if no code is provided) and a JSON object containing success set to false and the error message.
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };