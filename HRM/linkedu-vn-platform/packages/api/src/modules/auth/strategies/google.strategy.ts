import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private config: ConfigService, private authService: AuthService) {
    const clientId = config.get<string>('GOOGLE_CLIENT_ID', '')
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET', '')

    super(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: clientId
          ? config.get<string>('GOOGLE_CALLBACK_URL', '/api/auth/google/callback')
          : '',
        scope: ['email', 'profile'],
      } as any,
    )
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): any {
    const email = profile?.emails?.[0]?.value || ''
    return this.authService.validateOAuthUser(
      'google',
      profile?.id,
      email,
      profile?.displayName,
    )
  }
}
