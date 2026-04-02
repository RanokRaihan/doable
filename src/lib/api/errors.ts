export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;
  public readonly isApiError = true;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static isApiError(error: unknown): error is ApiError {
    return (
      error instanceof ApiError ||
      (typeof error === "object" &&
        error !== null &&
        "isApiError" in error &&
        (error as ApiError).isApiError === true)
    );
  }

  static isUnauthorized(error: unknown): boolean {
    return ApiError.isApiError(error) && error.statusCode === 401;
  }
}
