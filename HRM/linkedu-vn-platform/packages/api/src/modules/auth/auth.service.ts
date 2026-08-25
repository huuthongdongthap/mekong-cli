import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { MailService } from '../../common/mail/mail.service'
import { UserRole, User } from '@prisma/client'

export interface JwtPayload {
  sub: string
  email: string
  role: UserRole
  schoolId?: string
  enterpriseId?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(data: {
    email?: string
    phone?: string
    password: string
    firstName: string
    lastName: string
    role?: UserRole
    schoolId?: string
    enterpriseId?: number
  }) {
    if (data.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: data.email },
      })
      if (existingEmail && !existingEmail.deletedAt) {
        throw new ConflictException('Email đã được đăng ký')
      }
    }

    if (data.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: data.phone },
      })
      if (existingPhone && !existingPhone.deletedAt) {
        throw new ConflictException('Số điện thoại đã được đăng ký')
      }
    }

    const saltRounds = 12
    const passwordHash = await bcrypt.hash(data.password, saltRounds)

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || UserRole.learner,
        schoolId: data.schoolId,
        enterpriseId: data.enterpriseId,
        emailVerified: false,
        phoneVerified: false,
      },
    })

    return this.generateTokens(user)
  }

  async login(identifier: string, password: string): Promise<TokenPair> {
    const isEmail = identifier.includes('@')
    const user = await this.prisma.user.findFirst({
      where: isEmail
        ? { email: identifier, deletedAt: null }
        : { phone: identifier, deletedAt: null },
    })

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    return this.generateTokens(user)
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    if (!refreshToken) throw new UnauthorizedException('Refresh token không hợp lệ')

    try {
      const payload = this.jwtService.verify(refreshToken) as any
      if (payload.type !== 'refresh') throw new UnauthorizedException()

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub, deletedAt: null },
      })
      if (!user) throw new UnauthorizedException('Người dùng không tồn tại')

      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email ?? '',
        role: user.role,
        schoolId: user.schoolId ?? undefined,
        enterpriseId: user.enterpriseId ?? undefined,
      }

      return {
        accessToken: this.jwtService.sign(jwtPayload),
        refreshToken: this.jwtService.sign(
          { sub: user.id, type: 'refresh' },
          { expiresIn: '7d' },
        ),
      }
    } catch {
      throw new UnauthorizedException('Refresh token hết hạn')
    }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    })
  }

  async forgotPassword(email: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    })
    if (!user) return null // Don't reveal whether email exists
    return this.generateResetToken(user.id)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded: any
    try {
      decoded = this.jwtService.verify(token)
    } catch {
      throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn')
    }
    if (decoded.type !== 'reset') throw new BadRequestException('Token không hợp lệ')

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await this.prisma.user.update({
      where: { id: decoded.sub },
      data: { passwordHash: hashedPassword },
    })
  }

  generateResetToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId, type: 'reset' },
      { expiresIn: '15m' },
    )
  }

  async validateOAuthUser(
    provider: string,
    providerId: string,
    email: string,
    firstName?: string,
    lastName?: string,
  ): Promise<{ userId: string; isNew: boolean }> {
    if (!email) {
      throw new BadRequestException('OAuth provider không trả về email')
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { userId: existingUser.id, isNew: false }
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        firstName: firstName || provider,
        lastName: lastName || providerId?.slice(0, 6) || '',
        passwordHash: await bcrypt.hash(providerId, 12),
        role: UserRole.learner,
        emailVerified: true,
      },
    })

    return { userId: user.id, isNew: true }
  }

  async generateTokens(user: User): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email ?? '',
      role: user.role,
      schoolId: user.schoolId ?? undefined,
      enterpriseId: user.enterpriseId ?? undefined,
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' },
    )

    return { accessToken, refreshToken }
  }
}