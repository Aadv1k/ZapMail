export enum ErrorCodes {
  VALIDATION = 'validation_error',
  DATABASE = 'database_error',
  EXTERNAL_SERVICE = 'external_service_error',
  RESOURCE_NOT_FOUND = 'resource_not_found_error',
  BAD_INPUT = "bad_input",
  TOO_MANY_REQUESTS = "too_many_requests",
  INTERNAL_ERROR = "internal_error",
}

export interface ApiError {
		error: {
				code: ErrorCodes,
				message: string,
				details?: any,
		}
		status: number,
}
