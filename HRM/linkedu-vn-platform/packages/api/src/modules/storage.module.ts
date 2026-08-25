import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'R2_CONFIG',
      useFactory: () => ({
        accountId: process.env.R2_ACCOUNT_ID,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        bucket: process.env.R2_BUCKET ?? 'linkededu-dev-files',
        publicUrl: process.env.R2_PUBLIC_URL,
      }),
    },
  ],
  exports: ['R2_CONFIG'],
})
export class StorageModule {}
