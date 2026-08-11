import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './common/prisma/prisma.module'
import { RedisModule } from './modules/redis.module'
import { StorageModule } from './modules/storage.module'
import { LoggerModule } from './modules/logger.module'
import { HealthModule } from './modules/health/health.module'
import { ViEnExceptionFilter } from './common/filters/vi-en.exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.development'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60'),
        limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100'),
      },
    ]),
    PrismaModule,
    RedisModule,
    StorageModule,
    LoggerModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: ViEnExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
  exports: [PrismaModule],
})
export class AppConfigModule {}
