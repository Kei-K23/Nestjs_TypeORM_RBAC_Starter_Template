import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message = (exceptionResponse as any).message || exception.message;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        details = (exceptionResponse as any).details || null;

        // Handle validation errors
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (Array.isArray((exceptionResponse as any).message)) {
          message = 'Validation failed';
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          details = (exceptionResponse as any).message;
        }
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = ResponseUtil.error(
      message,
      status,
      this.getErrorName(status),
      details,
    );

    response.status(status).json(errorResponse);
  }

  private getErrorName(status: number): string {
    switch (status) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Validation Error';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}
