import { Controller, Post, Get, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Req, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger'
import { DocumentsService } from './documents.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { RolesGuard } from '@linkedu/api/modules/auth/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { UserRole, DocumentType } from '@prisma/client'


@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({ fileType: /^(application\/pdf|image\/|application\/json|application\/msword|application\/vnd\.openxmlformats-officedocument\.)/ }),
        ],
      }),
    )
    file: any,
    @Req() req: any,
  ) {
    const { entityType, entityId, documentType, metadata } = req.body

    if (!entityType || !entityId || !documentType) {
      throw new Error('entityType, entityId, and documentType are required')
    }

    const crypto = await import('crypto')
    const hash = crypto.createHash('sha256').update(file.buffer).digest('hex')

    const document = await this.documentsService.create({
      entityType,
      entityId,
      documentType: documentType as DocumentType,
      filename: `${Date.now()}-${file.originalname}`,
      originalFilename: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedById: req.user.id,
      sha256Hash: hash,
      metadata: metadata ? JSON.parse(metadata) : undefined,
    }, file.buffer)

    return document
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get all documents for an entity' })
  async getByEntity(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.documentsService.findByEntity(entityType, entityId)
  }

  @Get('entity/:entityType/:entityId/type/:documentType')
  @ApiOperation({ summary: 'Get documents by entity and type' })
  async getByEntityAndType(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Param('documentType') documentType: DocumentType,
  ) {
    return this.documentsService.findByType(entityType, entityId, documentType)
  }

  @Get(':id/signed-url')
  @ApiOperation({ summary: 'Get signed download URL for a document' })
  async getSignedUrl(@Param('id') id: string, @Req() _req: any) {
    const url = await this.documentsService.getSignedUrl(id)
    return { url }
  }

  @Delete(':id')
  @Roles(UserRole.school_admin, UserRole.enterprise_admin, UserRole.super_admin)
  @ApiOperation({ summary: 'Delete a document' })
  async delete(@Param('id') id: string) {
    await this.documentsService.delete(id)
    return { success: true }
  }
}