import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  PayloadTooLargeException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(PayloadTooLargeException)
export class PayloadTooLargeFilter implements ExceptionFilter {
  catch(exception: PayloadTooLargeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
      statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
      message:
        'Request entity too large. Please reduce the size of the request payload. Maximum size allowed is 50MB.',
    });
  }
}
