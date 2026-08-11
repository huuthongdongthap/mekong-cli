import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { MsStrategy } from './strategies/ms.strategy'
import { MailModule } from '@linkedu/api/common/mail/mail.module'

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_ACCESS_EXPIRY', '15m') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // Only register OAuth strategies if credentials are provided
    {
      provide: 'OAUTH_STRATEGIES',
      useFactory: (config: ConfigService) => {
        const strategies = []
        if (config.get('GOOGLE_CLIENT_ID') && config.get('GOOGLE_CLIENT_SECRET')) {
          strategies.push(GoogleStrategy)
        }
        if (config.get('MS_CLIENT_ID') && config.get('MS_CLIENT_SECRET')) {
          strategies.push(MsStrategy)
        }
        return strategies
      },
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}