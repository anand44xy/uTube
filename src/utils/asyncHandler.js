// asyncHandler is a higher-order function that takes a request handler function as an argument.
const asyncHandler = (requestHandler) => {
    // It returns a new function that takes req, res, and next as parameters.
    return (req, res, next) => {
        // Executes the requestHandler function and ensures it returns a resolved Promise.
        Promise.resolve(requestHandler(req, res, next))
            // If the Promise is rejected (error occurs), pass the error to the next middleware.
            .catch((err) => next(err));
    };
};

export { asyncHandler };

// NOTE:- This function is commonly used in Express.js to handle async errors without requiring try-catch blocks in every route handler. 🚀