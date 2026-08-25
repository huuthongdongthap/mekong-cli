import { Controller, Get, Post, Param, Body, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import { InternshipCertificateService } from './internship-certificate.service'
import { CreateInternshipCertificateDto, IssueCertificateDto } from './dto/internship-certificate.dto'

@Controller('internship-certificates')
@UseGuards(JwtAuthGuard, TenantGuard)
export class InternshipCertificateController {
  constructor(private readonly service: InternshipCertificateService) {}

  @Get('learner/:learnerId')
  @Roles('super_admin', 'school_admin', 'enterprise_admin', 'learner')
  async getCertificatesByLearner(@Param('learnerId') learnerId: string) {
    return this.service.getCertificatesByLearner(learnerId)
  }

  @Get(':id')
  @Roles('super_admin', 'school_admin', 'enterprise_admin', 'learner')
  async getCertificateById(@Param('id') certificateId: string) {
    return this.service.getCertificateById(certificateId)
  }

  @Post('generate')
  @Roles('super_admin', 'school_admin')
  async generateFromEnrollment(
        @Body('enrollmentId') _enrollmentId: string,
        @Body('issuedById') _issuedById: string
  ) {
    // This was removed - use createCertificate instead
    return { error: 'Use POST /internship-certificates to create a certificate' }
  }

  @Post()
  @Roles('super_admin', 'school_admin')
  async createCertificate(@Body() dto: CreateInternshipCertificateDto) {
    return this.service.createCertificate(dto)
  }

  @Post(':id/issue')
  @Roles('super_admin', 'school_admin')
  async issueCertificate(
    @Param('id') certificateId: string,
    @Body() dto: IssueCertificateDto,
  ) {
    return this.service.issueCertificate(certificateId, dto)
  }

  @Post(':id/revoke')
  @Roles('super_admin', 'school_admin')
  async revokeCertificate(
    @Param('id') certificateId: string,
    @Body('revokedById') revokedById: string,
    @Body('reason') reason?: string
  ) {
    return this.service.revokeCertificate(certificateId, revokedById, reason)
  }

  @Get('verify/:certificateNumber')
  async verifyCertificate(@Param('certificateNumber') certificateNumber: string) {
    return this.service.verifyCertificate(certificateNumber)
  }

  @Get('pdf/:certificateNumber(*)')
  async downloadPdf(
    @Param('certificateNumber') certificateNumber: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.service.getCertificatePdf(certificateNumber)

    const filename = `${certificateNumber.replace(/\//g, '-')}.pdf`

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length.toString(),
    })

    res.send(pdfBuffer)
  }
}