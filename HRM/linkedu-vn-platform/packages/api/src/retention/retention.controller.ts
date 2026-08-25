import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { RetentionService } from './retention.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'

@Controller('retention')
@UseGuards(JwtAuthGuard)
export class RetentionController {
  constructor(private readonly service: RetentionService) {}

  @Get(':flagKey')
  async getRetention(@Param('flagKey') flagKey: string) {
    return this.service.computeRetention(flagKey)
  }
}
