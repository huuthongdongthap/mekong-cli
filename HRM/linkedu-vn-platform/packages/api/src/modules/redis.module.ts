import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
        const client = new Redis(url);
        client.on('error', (err: Error) => console.error('❌ Redis Client Error:', err));
        client.on('connect', () => console.log('✅ Redis connected'));
        client.on('close', () => console.warn('⚠️ Redis connection closed'));
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
