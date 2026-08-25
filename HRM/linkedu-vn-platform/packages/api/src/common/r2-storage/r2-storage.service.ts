import { Injectable, Logger } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name)
  private readonly client: S3Client
  private readonly bucket: string
  private readonly publicUrl: string
  private readonly accountId: string

  constructor() {
    this.accountId = process.env.R2_ACCOUNT_ID || ''
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    })
    this.bucket = process.env.R2_BUCKET || 'linkededu-dev'
    this.publicUrl = process.env.R2_PUBLIC_URL || `https://${this.accountId}.r2.dev`
  }

  async upload(key: string, buffer: Buffer, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    })

    await this.client.send(command)
    this.logger.log(`Uploaded to R2: ${key}`)
    return `${this.publicUrl}/${key}`
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })
    return getSignedUrl(this.client, command, { expiresIn })
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })
    await this.client.send(command)
    this.logger.log(`Deleted from R2: ${key}`)
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
      await this.client.send(command)
      return true
    } catch {
      return false
    }
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`
  }
}