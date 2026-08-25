import { Injectable, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common'
import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer'

@Injectable()
export class PuppeteerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PuppeteerService.name)
  private browser: Browser | null = null

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    })
    this.logger.log('Puppeteer browser initialized')
  }

  async generatePdf(html: string, options?: PDFOptions): Promise<Buffer> {
    if (!this.browser) {
      await this.onModuleInit()
    }

    const page: Page = await this.browser!.newPage()

    try {
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      })

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
        ...options,
      })

      return Buffer.from(pdfBuffer)
    } catch (error: unknown) {
      const err = error as Error
      this.logger.error(`PDF generation failed: ${err.message}`)
      throw error
    } finally {
      await page.close()
    }
  }

  async generatePdfFromUrl(url: string, options?: PDFOptions): Promise<Buffer> {
    if (!this.browser) {
      await this.onModuleInit()
    }

    const page: Page = await this.browser!.newPage()

    try {
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      })

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
        ...options,
      })

      return Buffer.from(pdfBuffer)
    } catch (error: unknown) {
      const err = error as Error
      this.logger.error(`PDF generation from URL failed: ${err.message}`)
      throw error
    } finally {
      await page.close()
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close()
      this.logger.log('Puppeteer browser closed')
    }
  }
}