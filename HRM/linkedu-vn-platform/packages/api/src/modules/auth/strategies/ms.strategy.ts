import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-microsoft'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'

@Injectable()
export class MsStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private config: ConfigService, private authService: AuthService) {
    super({
      clientID: config.get('MS_CLIENT_ID', '') || undefined,
      clientSecret: config.get('MS_CLIENT_SECRET', '') || undefined,
      tenantID: config.get('MS_TENANT_ID', 'common'),
      callbackURL: '',
      scope: ['user.read'],
      // Mont userProfileURL mặc định của passport-microsoft
      userProfileURL: 'https://graph.microsoft.com/v1.0/me',
    } as any)
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const email = profile?.emails?.[0]?.value || (profile._json?.mail as string | undefined)
    return this.authService.validateOAuthUser(
      'microsoft',
      profile?.id,
      email,
      profile?.displayName,
    )
  }
}
