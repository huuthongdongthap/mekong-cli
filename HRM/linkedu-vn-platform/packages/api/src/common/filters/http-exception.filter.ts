import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      typeof exception === 'object' && exception !== null && 'message' in exception
        ? String((exception as { message: unknown }).message)
        : status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal server error'
          : String(exception);

    const error =
      exception instanceof HttpException
        ? exception.getResponse()
        : undefined;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(error !== undefined ? { error } : {}),
    });
  }
}
