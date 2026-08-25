import { Injectable } from '@nestjs/common'
import QRCode from 'qrcode'

@Injectable()
export class QrCodeService {
  async generate(url: string, options?: QRCode.QRCodeToBufferOptions): Promise<Buffer> {
    const defaultOptions: QRCode.QRCodeToBufferOptions = {
      width: parseInt(process.env.QR_CODE_SIZE || '300'),
      margin: 2,
      color: {
        dark: '#1e3a5f',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
      ...options,
    }

    return QRCode.toBuffer(url, defaultOptions)
  }

  async generateDataUrl(url: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
    const defaultOptions: QRCode.QRCodeToDataURLOptions = {
      width: parseInt(process.env.QR_CODE_SIZE || '300'),
      margin: 2,
      color: {
        dark: '#1e3a5f',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
      ...options,
    }

    return QRCode.toDataURL(url, defaultOptions)
  }

  async generateSvg(url: string, options?: QRCode.QRCodeToStringOptions): Promise<string> {
    const defaultOptions: QRCode.QRCodeToStringOptions = {
      width: parseInt(process.env.QR_CODE_SIZE || '300'),
      margin: 2,
      color: {
        dark: '#1e3a5f',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
      ...options,
    }

    return QRCode.toString(url, { ...defaultOptions, type: 'svg' })
  }
}