import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

export interface JwtPayload {
  sub: string
  email: string
  role: string
  schoolId?: string
  enterpriseId?: number | string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    const jwtSecret = config.get<string>('JWT_SECRET') || 'test-secret-key-for-development';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,  // passport-jwt v4 expects secretOrKey not secretOrPrivateKey
    })
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      schoolId: payload.schoolId,
      enterpriseId: payload.enterpriseId ? Number(payload.enterpriseId) : undefined,
    }
  }
}
