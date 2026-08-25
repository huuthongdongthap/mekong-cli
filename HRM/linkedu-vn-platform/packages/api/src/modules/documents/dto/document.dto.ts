import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsNumber, IsUUID, IsNotEmpty } from 'class-validator'
import { DocumentType } from '@prisma/client'

export class CreateDocumentDto {
  @ApiProperty({ description: 'Type of entity this document belongs to', example: 'learner' })
  @IsString()
  @IsNotEmpty()
  entityType: string

  @ApiProperty({ description: 'ID of the entity', example: 'uuid-of-learner' })
  @IsString()
  @IsNotEmpty()
  entityId: string

  @ApiProperty({ description: 'Document type', enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType

  @ApiProperty({ description: 'Generated filename for storage', example: '1234567890-certificate.pdf' })
  @IsString()
  @IsNotEmpty()
  filename: string

  @ApiProperty({ description: 'Original filename from upload', example: 'certificate.pdf' })
  @IsString()
  @IsNotEmpty()
  originalFilename: string

  @ApiProperty({ description: 'File size in bytes', example: 1024000 })
  @IsNumber()
  fileSize: number

  @ApiProperty({ description: 'MIME type of the file', example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  mimeType: string

  @ApiProperty({ description: 'SHA256 hash of the file content', example: 'a1b2c3d4...' })
  @IsString()
  @IsNotEmpty()
  sha256Hash: string

  @ApiProperty({ description: 'User ID who uploaded the document', required: false })
  @IsOptional()
  @IsUUID()
  uploadedById?: string

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>
}

export class DocumentQueryDto {
  @ApiProperty({ description: 'Entity type filter', required: false })
  @IsOptional()
  @IsString()
  entityType?: string

  @ApiProperty({ description: 'Entity ID filter', required: false })
  @IsOptional()
  @IsString()
  entityId?: string

  @ApiProperty({ description: 'Document type filter', enum: DocumentType, required: false })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType

  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @IsOptional()
  @IsNumber()
  page?: number = 1

  @ApiProperty({ description: 'Items per page', default: 20, required: false })
  @IsOptional()
  @IsNumber()
  limit?: number = 20
}