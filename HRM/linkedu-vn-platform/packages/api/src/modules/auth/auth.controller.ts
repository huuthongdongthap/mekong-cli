import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard.wrapper'
import { Public } from '@linkedu/api/common/decorators/public.decorator'
import { RegisterDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto'
import { UserRole, User } from '@prisma/client'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() dto: RegisterDto) {
    return this.authService.register({
      email: dto.email,
      phone: dto.phone,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role as UserRole,
      schoolId: dto.schoolId,
      enterpriseId: dto.enterpriseId ? Number(dto.enterpriseId) : undefined,
    })
  }

  @Post('login')
  @Public()
  async login(@Body() dto: { identifier: string; password: string }) {
    return this.authService.login(dto.identifier, dto.password)
  }

  @Post('refresh')
  @Public()
  async refresh(@Body() dto: { refreshToken: string }) {
    return this.authService.refresh(dto.refreshToken)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' })
    return this.authService.logout(req.user.id)
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email)
  }

  @Post('reset-password')
  @Public()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const { token, newPassword } = dto
    return this.authService.resetPassword(token, newPassword)
  }

  // ── OAuth entry points (passport strategies handle redirects) ──────────────

  @Get('google')
  @Public()
  async googleAuth() {
    // passport-google-oauth20 Strategy handles the redirect
  }

  @Get('google/callback')
  @Public()
  async googleCallback(@Req() req: any) {
    const user = req.user as User
    return this.authService.generateTokens(user)
  }

  @Get('microsoft')
  @Public()
  async microsoftAuth() {
    // passport-microsoft Strategy handles the redirect
  }

  @Get('microsoft/callback')
  @Public()
  async microsoftCallback(@Req() req: any) {
    const user = req.user as User
    return this.authService.generateTokens(user)
  }

  // ── Email Verification ──────────────────────────────────────────────────────

  @Get('verify-email')
  @Public()
  async verifyEmail(@Query('token') _token: string) {
    // Phase 3: wire verification token validation
    return { ok: true, message: 'Sử dụng endpoint này để xác thực email' }
  }
}