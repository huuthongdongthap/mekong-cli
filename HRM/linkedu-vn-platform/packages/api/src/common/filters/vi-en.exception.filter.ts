import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common'
import { Response } from 'express'

/**
 * RFC 7807 Problem Details + Vietnamese/English bilingual error format.
 *
 * Success envelope (from service layer):
 *   { success: true, data: {...}, meta: { page, limit, total } }
 *
 * Error envelope (from this filter):
 *   {
 *     success: false,
 *     error: {
 *       code: "VALIDATION_ERROR",
 *       message: "Dữ liệu không hợp lệ",
 *       messageEn: "Validation failed",
 *       details: [{ field: "email", message: "Email đã tồn tại" }],
 *       requestId: "abc-123"
 *     },
 *     timestamp: "2025-01-15T10:00:00Z",
 *     path: "/api/v1/learners"
 *   }
 */
@Catch(HttpException)
export class ViEnExceptionFilter implements ExceptionFilter {
  private readonly viMessages: Record<string, string> = {
    VALIDATION_FAILED: 'Dữ liệu không hợp lệ',
    BAD_REQUEST: 'Yêu cầu không hợp lệ',
    UNAUTHORIZED: 'Chưa xác thực — vui lòng đăng nhập',
    FORBIDDEN: 'Không có quyền truy cập',
    NOT_FOUND: 'Không tìm thấy tài nguyên',
    CONFLICT: 'Xung đột dữ liệu',
    TOO_MANY_REQUESTS: 'Quá nhiều yêu cầu — vui lòng thử lại sau',
    INTERNAL_ERROR: 'Lỗi hệ thống — vui lòng thử lại sau',
    PAYLOAD_TOO_LARGE: 'Dữ liệu quá lớn',
    UNSUPPORTED_MEDIA_TYPE: 'Định dạng file không hỗ trợ',
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    // Extract error code and details
    let code = 'INTERNAL_ERROR'
    let messageVi = this.viMessages.INTERNAL_ERROR
    let messageEn = 'Internal server error'
    let details: any[] = []

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as any
      code = resp.code || exception.message || 'INTERNAL_ERROR'
      messageVi = resp.messageVi || this.viMessages[code] || exception.message
      messageEn = resp.messageEn || code
      details = resp.details || []
    } else {
      messageVi = this.viMessages[code] || exception.message
      messageEn = exception.message
    }

    // Map Prisma error codes to friendly messages
    if (code === 'P2002') {
      code = 'DUPLICATE_ENTRY'
      messageVi = 'Dữ liệu đã tồn tại'
      messageEn = 'Duplicate entry'
    } else if (code === 'P2025') {
      code = 'NOT_FOUND'
      messageVi = 'Không tìm thấy tài nguyên'
      messageEn = 'Record not found'
    } else if (code === 'P2003') {
      code = 'FOREIGN_KEY_FAILED'
      messageVi = 'Tham chiếu không hợp lệ'
      messageEn = 'Foreign key constraint failed'
    }

    const errorBody = {
      success: false,
      error: {
        code,
        message: messageVi,
        messageEn,
        details,
        requestId: (request.headers as unknown as Record<string, string>)['x-request-id'] || '',
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    response.status(status).json(errorBody)
  }
}

/**
 * Catches unhandled exceptions (500) with same RFC 7807 format.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống — vui lòng thử lại sau',
        messageEn: 'Internal server error',
        details: [],
        requestId: (request.headers as unknown as Record<string, string>)['x-request-id'] || '',
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
