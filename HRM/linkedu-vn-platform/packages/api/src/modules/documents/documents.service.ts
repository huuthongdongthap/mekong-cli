import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { R2StorageService } from '../../common/r2-storage/r2-storage.service'
import { DocumentType } from '@prisma/client'

export interface CreateDocumentDto {
  entityType: string
  entityId: string
  documentType: DocumentType
  filename: string
  originalFilename: string
  fileSize: number
  mimeType: string
  uploadedById: string
  sha256Hash: string
  metadata?: Record<string, any>
}

export interface UploadedDocument {
  id: string
  entityType: string
  entityId: string
  documentType: DocumentType
  filename: string
  originalFilename: string
  fileSize: number
  mimeType: string
  r2Bucket: string
  r2Key: string
  r2Url: string
  uploadedById: string
  uploadedAt: Date
  sha256Hash: string
  metadata?: Record<string, any>
}

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name)

  constructor(
    private prisma: PrismaService,
    private r2Service: R2StorageService,
  ) {}

  async create(dto: CreateDocumentDto, buffer: Buffer): Promise<UploadedDocument> {
    const key = `documents/${dto.entityType}/${dto.entityId}/${dto.filename}`

    const url = await this.r2Service.upload(key, buffer, dto.mimeType)

    const document = await this.prisma.document.create({
      data: {
        entityType: dto.entityType,
        entityId: dto.entityId,
        documentType: dto.documentType,
        filename: dto.filename,
        originalFilename: dto.originalFilename,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        r2Bucket: process.env.R2_BUCKET || 'linkededu-dev',
        r2Key: key,
        r2Url: url,
        uploadedById: dto.uploadedById,
        sha256Hash: dto.sha256Hash,
        metadata: dto.metadata,
      },
    })

    this.logger.log(`Document uploaded: ${document.id} (${dto.originalFilename})`)

    return document as UploadedDocument
  }

  async findById(id: string): Promise<UploadedDocument | null> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    })

    return document as UploadedDocument | null
  }

  async findByEntity(entityType: string, entityId: string): Promise<UploadedDocument[]> {
    return this.prisma.document.findMany({
      where: { entityType, entityId },
      orderBy: { uploadedAt: 'desc' },
    }) as Promise<UploadedDocument[]>
  }

  async findByType(entityType: string, entityId: string, documentType: DocumentType): Promise<UploadedDocument[]> {
    return this.prisma.document.findMany({
      where: { entityType, entityId, documentType },
      orderBy: { uploadedAt: 'desc' },
    }) as Promise<UploadedDocument[]>
  }

  async getSignedUrl(id: string, expiresIn = 3600): Promise<string> {
    const document = await this.findById(id)
    if (!document) {
      throw new NotFoundException('Document not found')
    }

    return this.r2Service.getSignedUrl(document.r2Key, expiresIn)
  }

  async delete(id: string): Promise<void> {
    const document = await this.findById(id)
    if (!document) {
      throw new NotFoundException('Document not found')
    }

    await this.r2Service.delete(document.r2Key)
    await this.prisma.document.delete({ where: { id } })

    this.logger.log(`Document deleted: ${id}`)
  }

  async verifyHash(id: string, buffer: Buffer): Promise<boolean> {
    const document = await this.findById(id)
    if (!document) {
      throw new NotFoundException('Document not found')
    }

    const crypto = await import('crypto')
    const hash = crypto.createHash('sha256').update(buffer).digest('hex')

    return hash === document.sha256Hash
  }
}