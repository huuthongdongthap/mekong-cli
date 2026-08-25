import { Injectable, Logger } from '@nestjs/common'
import { Resend } from 'resend'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly resend: Resend | null
  private readonly fromEmail: string

  constructor() {
    this.fromEmail = process.env.MAIL_FROM || 'LinkEduVN <onboarding@resend.dev>'
    this.resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.WEB_APP_URL || ''}/reset-password?token=${token}`

    return this.send(email, 'Đặt lại mật khẩu LinkEduVN', `
      <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu tài khoản LinkEduVN.</p>
      <p>Nhấn vào đường link sau để đặt lại mật khẩu (hiệu lực 1 giờ):</p>
      <p><a href="${resetUrl}">Đặt lại mật khẩu</a></p>
      <p>Mã token: <code>${token}</code></p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `)
  }

  async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${process.env.WEB_APP_URL || ''}/verify-email?token=${token}`

    return this.send(email, 'Xác thực email LinkEduVN', `
      <p>Chào mừng bạn đến với LinkEduVN!</p>
      <p>Nhấn vào đường link sau để xác thực email của bạn:</p>
      <p><a href="${verifyUrl}">Xác thực email</a></p>
      <p>Mã token: <code>${token}</code></p>
    `)
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    return this.send(email, 'Chào mừng đến với LinkEduVN', `
      <p>Xin chào ${firstName},</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản LinkEduVN — nền tảng liên kết đào tạo thực chiến Việt Nam.</p>
      <p>Bạn có thể bắt đầu khám phá các chương trình đào tạo ngay bây giờ.</p>
    `)
  }

  /**
   * Sends via Resend when RESEND_API_KEY is configured.
   * Falls back to log-only so auth flows never break in dev/CI without mail creds.
   */
  private async send(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.warn(`[MAIL:dev-only] "${subject}" → ${to} (RESEND_API_KEY not set, not sent)`)
      return { success: true, delivered: false }
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      })

      if (error) {
        this.logger.error(`Resend send failed to ${to}: ${error.message}`)
        return { success: false, delivered: false }
      }

      this.logger.log(`Email "${subject}" sent to ${to} (id=${data?.id})`)
      return { success: true, delivered: true }
    } catch (err) {
      this.logger.error(`Resend request failed for ${to}: ${err}`)
      return { success: false, delivered: false }
    }
  }
}
