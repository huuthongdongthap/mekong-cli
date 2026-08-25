import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { PdfGenerationService } from '@linkedu/api/common/pdf/pdf-generation.service'
import { CertificateData } from '@linkedu/api/common/pdf/pdf.types'
import { QrCodeService } from '@linkedu/api/common/qr-code/qr-code.service'
import { R2StorageService } from '@linkedu/api/common/r2-storage/r2-storage.service'
import { CreateInternshipCertificateDto, IssueCertificateDto } from './dto/internship-certificate.dto'
import { CertificateStatus } from '@prisma/client'

@Injectable()
export class InternshipCertificateService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfGenerationService,
    private qrService: QrCodeService,
    private r2Service: R2StorageService,
  ) {}

  async createCertificate(dto: CreateInternshipCertificateDto) {
    const certificate = await this.prisma.internshipCertificate.create({
      data: {
        learnerId: dto.learnerId,
        enrollmentId: dto.enrollmentId,
        enterpriseId: dto.enterpriseId,
        programId: dto.programId,
        certificateNumber: dto.certificateNumber,
        issueDate: new Date(dto.issueDate),
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        totalHours: dto.totalHours,
        position: dto.position,
        department: dto.department || null,
        supervisorName: dto.supervisorName,
        supervisorTitle: dto.supervisorTitle || null,
        evaluationScore: dto.evaluationScore || null,
        evaluationComment: dto.evaluationComment || null,
        skillsAcquired: dto.skillsAcquired || [],
        achievements: dto.achievements || [],
        status: CertificateStatus.draft,
        issuedById: dto.issuedById,
      },
    })

    return certificate
  }

  async issueCertificate(certificateId: string, dto: IssueCertificateDto) {
    const cert = await this.prisma.internshipCertificate.findUnique({
      where: { id: certificateId },
      include: {
        learner: true,
        enterprise: true,
        program: true,
      },
    })

    if (!cert) {
      throw new NotFoundException('Certificate not found')
    }

    if (cert.status === CertificateStatus.issued) {
      throw new BadRequestException('Certificate already issued')
    }

    if (cert.status === CertificateStatus.revoked) {
      throw new BadRequestException('Cannot issue revoked certificate')
    }

    // Generate QR code first (needed for PDF)
    const verifyUrl = `${process.env.APP_URL || 'http://localhost:3001'}/verify/certificate/${cert.certificateNumber}`
    const qrBuffer = await this.qrService.generate(verifyUrl)
    const qrUrl = await this.r2Service.upload(`certificates/qr/${cert.certificateNumber}.png`, qrBuffer, 'image/png')

    // Generate PDF with QR code
    const certData: CertificateData = {
      certificateNumber: cert.certificateNumber,
      learnerName: cert.learner.fullName,
      enterpriseName: cert.enterprise.name,
      enterpriseTaxCode: cert.enterprise.taxCode,
      programName: cert.program.name,
      programField: cert.program.field,
      issueDate: cert.issueDate,
      startDate: cert.startDate,
      endDate: cert.endDate,
      totalHours: cert.totalHours,
      position: cert.position,
      department: cert.department || undefined,
      supervisorName: cert.supervisorName,
      supervisorTitle: cert.supervisorTitle || undefined,
      evaluationScore: cert.evaluationScore || undefined,
      evaluationComment: cert.evaluationComment || undefined,
      skillsAcquired: cert.skillsAcquired,
      achievements: cert.achievements,
      qrCodeUrl: qrUrl,
    }

    const pdfBuffer = await this.pdfService.generateCertificate(certData)
    const pdfUrl = await this.r2Service.upload(`certificates/${cert.certificateNumber}.pdf`, pdfBuffer, 'application/pdf')

    return this.prisma.internshipCertificate.update({
      where: { id: certificateId },
      data: {
        certificateUrl: pdfUrl,
        qrCodeUrl: qrUrl,
        status: CertificateStatus.issued,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
      },
    })
  }

  async revokeCertificate(certificateId: string, revokedById: string, _reason?: string) {
    const cert = await this.prisma.internshipCertificate.findUnique({
      where: { id: certificateId },
    })

    if (!cert) {
      throw new NotFoundException('Certificate not found')
    }

    if (cert.status === CertificateStatus.revoked) {
      throw new BadRequestException('Certificate already revoked')
    }

    return this.prisma.internshipCertificate.update({
      where: { id: certificateId },
      data: {
        status: CertificateStatus.revoked,
        revokedAt: new Date(),
        revokedById,
      },
    })
  }

  async verifyCertificate(certificateNumber: string) {
    const cert = await this.prisma.internshipCertificate.findUnique({
      where: { certificateNumber },
      include: {
        learner: {
          select: { fullName: true, id: true },
        },
        enterprise: { select: { name: true, taxCode: true } },
        program: { select: { name: true, field: true, qualificationLevel: true } },
      },
    })

    if (!cert || cert.status !== CertificateStatus.issued) {
      return {
        valid: false,
        reason: 'Certificate not found or revoked',
      }
    }

    return {
      valid: true,
      certificate: {
        number: cert.certificateNumber,
        learnerName: cert.learner.fullName,
        enterprise: cert.enterprise.name,
        enterpriseTaxCode: cert.enterprise.taxCode,
        program: cert.program.name,
        field: cert.program.field,
        qualificationLevel: cert.program.qualificationLevel,
        issueDate: cert.issueDate,
        startDate: cert.startDate,
        endDate: cert.endDate,
        totalHours: cert.totalHours,
        evaluationScore: cert.evaluationScore,
        position: cert.position,
        department: cert.department,
        supervisorName: cert.supervisorName,
        supervisorTitle: cert.supervisorTitle,
      },
    }
  }

  async getCertificatePdf(certificateNumber: string): Promise<Buffer> {
    const cert = await this.prisma.internshipCertificate.findUnique({
      where: { certificateNumber },
      include: { learner: true, enterprise: true, program: true },
    })

    if (!cert) {
      throw new NotFoundException('Certificate not found')
    }

    if (cert.status !== CertificateStatus.issued) {
      throw new BadRequestException('Certificate is not issued')
    }

    const certData: CertificateData = {
      certificateNumber: cert.certificateNumber,
      learnerName: cert.learner.fullName,
      enterpriseName: cert.enterprise.name,
      enterpriseTaxCode: cert.enterprise.taxCode,
      programName: cert.program.name,
      programField: cert.program.field,
      issueDate: cert.issueDate,
      startDate: cert.startDate,
      endDate: cert.endDate,
      totalHours: cert.totalHours,
      position: cert.position,
      department: cert.department || undefined,
      supervisorName: cert.supervisorName,
      supervisorTitle: cert.supervisorTitle || undefined,
      evaluationScore: cert.evaluationScore || undefined,
      evaluationComment: cert.evaluationComment || undefined,
      skillsAcquired: cert.skillsAcquired,
      achievements: cert.achievements,
      qrCodeUrl: cert.qrCodeUrl || '',
    }

    return this.pdfService.generateCertificate(certData)
  }

  async getCertificatesByLearner(learnerId: string) {
    return this.prisma.internshipCertificate.findMany({
      where: { learnerId },
      include: {
        enterprise: { select: { name: true, logoUrl: true } },
        program: { select: { name: true, field: true } },
        enrollment: { select: { program: { select: { name: true } } } },
      },
      orderBy: { issueDate: 'desc' },
    })
  }

  async getCertificateById(certificateId: string) {
    const cert = await this.prisma.internshipCertificate.findUnique({
      where: { id: certificateId },
      include: {
        learner: true,
        enterprise: true,
        program: true,
        enrollment: { include: { program: true } },
      },
    })

    if (!cert) {
      throw new NotFoundException('Certificate not found')
    }

    return cert
  }

  // Helper methods
  private async generateCertificateNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.prisma.internshipCertificate.count({
      where: {
        certificateNumber: { startsWith: `CERT/${year}/` },
      },
    })
    return `CERT/${year}/${String(count + 1).padStart(5, '0')}`
  }
}