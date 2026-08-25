import { Module } from '@nestjs/common'
import { PdfGenerationService } from './pdf-generation.service'
import { PuppeteerService } from './puppeteer.service'

@Module({
  providers: [PdfGenerationService, PuppeteerService],
  exports: [PdfGenerationService, PuppeteerService],
})
export class PdfModule {}