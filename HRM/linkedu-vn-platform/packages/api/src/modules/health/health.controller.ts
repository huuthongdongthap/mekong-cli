import { Controller, Get } from '@nestjs/common'
import { HealthCheckService } from '@nestjs/terminus'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { SkipThrottle } from '@nestjs/throttler'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @SkipThrottle()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1 as result`
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        error: errorMessage,
      }
    }
  }
}