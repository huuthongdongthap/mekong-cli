import { Module } from '@nestjs/common'
import { InternshipCertificateService } from './internship-certificate.service'
import { InternshipCertificateController } from './internship-certificate.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'
import { QrCodeModule } from '@linkedu/api/common/qr-code/qr-code.module'
import { R2StorageModule } from '@linkedu/api/common/r2-storage/r2-storage.module'
import { PdfModule } from '@linkedu/api/common/pdf/pdf.module'

@Module({
  imports: [PrismaModule, QrCodeModule, R2StorageModule, PdfModule],
  controllers: [InternshipCertificateController],
  providers: [InternshipCertificateService],
  exports: [InternshipCertificateService],
})
export class InternshipCertificatesModule {}