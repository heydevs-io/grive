import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  Exception,
  SourcingInternalServerError,
} from 'src/common/exception/exception';
import { Logger } from 'winston';

@Catch()
export class GlobalHandleExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly logger: Logger;

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    this.logException(request, exception);

    if (exception instanceof Exception) {
      GlobalHandleExceptionFilter.sendResponse(request, response, exception);
    } else if (exception instanceof HttpException) {
      GlobalHandleExceptionFilter.sendBaseResponse(
        request,
        response,
        exception,
      );
    } else {
      GlobalHandleExceptionFilter.sendResponse(
        request,
        response,
        new SourcingInternalServerError(),
      );
    }
  }

  private logException(request: Request, exception: any): void {
    if (process.env.DISABLE_LOG_REQUEST === 'true') return;

    const errorLog = {
      timestamp: new Date().toISOString(),
      statusCode:
        exception instanceof HttpException ? exception.getStatus() : 500,
      message: this.getErrorMessage(exception),
      error: exception.name || 'Internal Server Error',
      stack: exception.stack,
    };

    this.logger.error('Request failed', errorLog);
  }

  private getErrorMessage(exception: any): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return response['message'] || exception.message;
    }
    return exception.message || 'Internal Server Error';
  }

  private static sendResponse(
    request: Request,
    response: Response,
    exception: Exception,
  ): void {
    const traceId = request.header('x-client-trace-id');
    response
      .status(exception.getStatus())
      .json(exception.prepareResponse(traceId));
  }

  private static sendBaseResponse(
    _: Request,
    response: Response,
    exception: HttpException,
  ): void {
    const expResponse = exception.getResponse();

    const statusCode = exception.getStatus();

    response
      .status(statusCode)
      .json({ statusCode, message: expResponse['message'] });
  }
}
