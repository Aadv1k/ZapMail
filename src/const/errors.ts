export enum ErrorCodes {
  UNKNOWN = 'unknown_error',
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'authentication_error',
  AUTHORIZATION = 'authorization_error',
  DATABASE = 'database_error',
  EXTERNAL_SERVICE = 'external_service_error',
  RATE_LIMIT = 'rate_limit_error',
  RESOURCE_NOT_FOUND = 'resource_not_found_error',
  BAD_INPUT = "bad_input",

}

export interface ApiError {
    error: {
	code: ErrorCodes,
	message: string,
	details?: string,
    }
    status: number,
}
