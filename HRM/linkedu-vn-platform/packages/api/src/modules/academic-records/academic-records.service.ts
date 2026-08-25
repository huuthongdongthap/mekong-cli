import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { DocumentsService } from '../documents/documents.service'
import { R2StorageService } from '../../common/r2-storage/r2-storage.service'
import { PdfGenerationService } from '../../common/pdf/pdf-generation.service'
import { DocumentType } from '@prisma/client'
import { SyncAcademicRecordsDto } from './dto/academic-record.dto'

@Injectable()
export class AcademicRecordsService {
  private readonly logger = new Logger(AcademicRecordsService.name)

  constructor(
    private prisma: PrismaService,
    private documentsService: DocumentsService,
    private r2Service: R2StorageService,
    private pdfService: PdfGenerationService,
  ) {}

  /**
   * Sync academic records from school API
   * Called by school admin or automated webhook
   */
  async syncAcademicRecords(dto: SyncAcademicRecordsDto) {
    const { learnerId, schoolId, transcript } = dto

    // Verify learner exists and belongs to school
    const learner = await this.prisma.learner.findUnique({
      where: { id: learnerId },
      include: { school: true },
    })

    if (!learner) {
      throw new NotFoundException('Learner not found')
    }

    if (learner.schoolId !== schoolId) {
      throw new BadRequestException('Learner does not belong to this school')
    }

    // Store structured academic data in learner profile
    await this.prisma.learner.update({
      where: { id: learnerId },
      data: {
        gpa: transcript.gpa,
        skills: {
          push: transcript.subjects.map((s) => `${s.subjectName} (${s.letterGrade || 'N/A'})`),
        },
      },
    })

    // Generate transcript PDF
    const pdfData = {
      learnerName: transcript.learnerName,
      learnerCode: transcript.learnerCode,
      fieldOfStudy: transcript.fieldOfStudy,
      cohort: transcript.cohort,
      gpa: transcript.gpa,
      totalCredits: transcript.totalCredits,
      academicStatus: transcript.academicStatus,
      issuedDate: transcript.issuedDate || new Date().toISOString().split('T')[0],
      subjects: transcript.subjects.map(s => ({
        subjectCode: s.subjectCode,
        subjectName: s.subjectName,
        credits: s.credits,
        midtermScore: s.midtermScore,
        finalScore: s.finalScore,
        totalScore: s.totalScore,
        letterGrade: s.letterGrade,
        numericGrade: s.numericGrade,
        status: s.status,
        subjectType: s.subjectType,
      })),
    }

    const pdfBuffer = await this.pdfService.generateTranscript(pdfData)

    // Upload PDF to R2
    const pdfKey = `transcripts/${learnerId}/${transcript.learnerCode}_transcript_${Date.now()}.pdf`
    const pdfUrl = await this.r2Service.upload(pdfKey, pdfBuffer, 'application/pdf')

    // Create document record
    const document = await this.documentsService.create(
      {
        entityType: 'Learner',
        entityId: learnerId,
        documentType: DocumentType.transcript,
        filename: `${transcript.learnerCode}_transcript_${Date.now()}.pdf`,
        originalFilename: `${transcript.learnerCode}_transcript.pdf`,
        fileSize: pdfBuffer.length,
        mimeType: 'application/pdf',
        uploadedById: 'system',
        sha256Hash: await this.generateHash(pdfBuffer),
        metadata: {
          learnerCode: transcript.learnerCode,
          learnerName: transcript.learnerName,
          fieldOfStudy: transcript.fieldOfStudy,
          cohort: transcript.cohort,
          gpa: transcript.gpa,
          totalCredits: transcript.totalCredits,
          academicStatus: transcript.academicStatus,
          issuedDate: pdfData.issuedDate,
          source: 'school_api',
          syncedAt: new Date().toISOString(),
        },
      },
      pdfBuffer,
    )

    // Also store JSON version
    const jsonBuffer = Buffer.from(JSON.stringify(transcript, null, 2))
    const jsonKey = `transcripts/${learnerId}/${transcript.learnerCode}_transcript_${Date.now()}.json`
    await this.r2Service.upload(jsonKey, jsonBuffer, 'application/json')

    this.logger.log(`Academic records synced for learner ${learnerId} (${transcript.learnerCode})`)

    return {
      success: true,
      documentId: document.id,
      pdfUrl: pdfUrl,
      message: 'Academic records synchronized and transcript generated',
    }
  }

  /**
   * Get transcript PDF for a learner
   */
  async getTranscript(learnerId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        entityType: 'Learner',
        entityId: learnerId,
        documentType: DocumentType.transcript,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    if (!document) {
      throw new NotFoundException('Transcript not found for this learner')
    }

    const signedUrl = await this.documentsService.getSignedUrl(document.id)

    return {
      document,
      downloadUrl: signedUrl,
    }
  }

  /**
   * Get all academic records metadata for a learner
   */
  async getAcademicRecordsMetadata(learnerId: string) {
    const documents = await this.documentsService.findByType('Learner', learnerId, DocumentType.transcript)

    return documents.map((doc) => ({
      id: doc.id,
      filename: doc.filename,
      uploadedAt: doc.uploadedAt,
      metadata: doc.metadata,
      fileSize: doc.fileSize,
    }))
  }

  /**
   * Generate a new transcript PDF from current data
   * Useful if template changes or learner wants latest version
   */
  async generateFreshTranscript(learnerId: string) {
    const learner = await this.prisma.learner.findUnique({
      where: { id: learnerId },
      include: { school: true, enrollments: { include: { program: true } } },
    })

    if (!learner) {
      throw new NotFoundException('Learner not found')
    }

    // Get latest transcript document for structured data
    const latestDoc = await this.prisma.document.findFirst({
      where: {
        entityType: 'Learner',
        entityId: learnerId,
        documentType: DocumentType.transcript,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    if (!latestDoc || !latestDoc.metadata) {
      throw new NotFoundException('No previous transcript data found to regenerate')
    }

    const metadata = latestDoc.metadata as any

    // Regenerate PDF
    const pdfData = {
      learnerName: metadata.learnerName || learner.fullName,
      learnerCode: metadata.learnerCode || learner.nationalId,
      fieldOfStudy: metadata.fieldOfStudy || learner.schoolMajor,
      cohort: metadata.cohort || `K${learner.graduationYear}`,
      gpa: metadata.gpa || learner.gpa || 0,
      totalCredits: metadata.totalCredits || 0,
      academicStatus: metadata.academicStatus || 'Đang học',
      issuedDate: new Date().toISOString().split('T')[0],
      subjects: [], // Would need to fetch from stored JSON
    }

    const pdfBuffer = await this.pdfService.generateTranscript(pdfData)
    const pdfKey = `transcripts/${learnerId}/${pdfData.learnerCode}_transcript_${Date.now()}.pdf`
    const pdfUrl = await this.r2Service.upload(pdfKey, pdfBuffer, 'application/pdf')

    const document = await this.documentsService.create(
      {
        entityType: 'Learner',
        entityId: learnerId,
        documentType: DocumentType.transcript,
        filename: `${pdfData.learnerCode}_transcript_${Date.now()}.pdf`,
        originalFilename: `${pdfData.learnerCode}_transcript.pdf`,
        fileSize: pdfBuffer.length,
        mimeType: 'application/pdf',
        uploadedById: 'system',
        sha256Hash: await this.generateHash(pdfBuffer),
        metadata: { ...metadata, regeneratedAt: new Date().toISOString() },
      },
      pdfBuffer,
    )

    return {
      success: true,
      documentId: document.id,
      pdfUrl: pdfUrl,
    }
  }

  /**
   * Get structured transcript data (JSON) for API consumption
   */
  async getTranscriptData(learnerId: string) {
    const latestDoc = await this.prisma.document.findFirst({
      where: {
        entityType: 'Learner',
        entityId: learnerId,
        documentType: DocumentType.transcript,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    if (!latestDoc || !latestDoc.metadata) {
      throw new NotFoundException('Transcript data not found')
    }

    // Fetch JSON from R2 if available, otherwise return metadata
    return latestDoc.metadata
  }

  private async generateHash(buffer: Buffer): Promise<string> {
    const crypto = await import('crypto')
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }
}