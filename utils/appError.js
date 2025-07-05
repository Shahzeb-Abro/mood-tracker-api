export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static handleValidationError(error) {
    const formatted = error.format();

    console.log("Formatted", formatted);

    const errors = Object.entries(formatted).reduce((acc, [field, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "_errors" in value &&
        Array.isArray(value._errors) &&
        value._errors.length > 0
      ) {
        // Check if the error message is "Required" and modify it
        const errorMessages = value._errors.map((err) => {
          if (err === "Required") {
            return `${
              field.charAt(0).toUpperCase() + field.slice(1)
            } is required`;
          }
          return err;
        });

        // Join the error messages for each field
        acc[field] = errorMessages.join(". ");
      }
      return acc;
    }, {});

    console.log("APp Errors", errors);

    const appError = new AppError("Invalid request data", 400);
    appError.errors = errors;
    return appError;
  }
}
