import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export type ExceptionInformation = {
  statusCode: number;
  message: string;
  data?: unknown;
};

export type ExceptionResponse = ExceptionInformation & {
  traceId?: string;
};

export class Exception extends HttpException {
  private readonly customInformation: ExceptionInformation;

  constructor(statusCode: HttpStatus, message: string, data?: unknown) {
    super(message, statusCode);
    this.customInformation = {
      statusCode,
      message,
      data,
    };
  }

  prepareResponse(traceId?: string): ExceptionResponse {
    return {
      ...this.customInformation,
      traceId,
    };
  }
}

type DataError = {
  [key: string]: { [key: string]: string } | null;
};

export class CustomBadRequestException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.BAD_REQUEST, message, data);
  }

  static fromValidationErrors(
    errors: ValidationError[],
  ): CustomBadRequestException {
    const data: DataError = {};
    const parseErrors = (
      errs: ValidationError[],
      result: DataError,
      parentProperty?: string,
    ): void => {
      errs.forEach((error) => {
        const property = parentProperty
          ? `${parentProperty}.${error.property}`
          : error.property;
        if (error.constraints) {
          // eslint-disable-next-line no-param-reassign
          result[property] = error.constraints;
        } else if (error.children?.length) {
          parseErrors(error.children, result, property);
        }
      });
    };
    parseErrors(errors, data);

    return new CustomBadRequestException('Validation failed', data);
  }
}

export class CustomUnauthorizedException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.UNAUTHORIZED, message, data);
  }
}

export class CustomForbiddenException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.FORBIDDEN, message, data);
  }
}

export class CustomNotFoundException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.NOT_FOUND, message, data);
  }
}

export class CustomNotAcceptableException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.NOT_ACCEPTABLE, message, data);
  }
}

export class CustomInternalServerError extends Exception {
  constructor() {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}
