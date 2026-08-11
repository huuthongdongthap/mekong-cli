import 'module-alias/register';
import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VERSION_NEUTRAL } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug', 'verbose'] });

  // -- Security middleware ---------------------------------------------------
  app.use(helmet());
  app.use(cookieParser());

  // -- CORS --
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3001'],
    credentials: true,
  });

  // -- Global prefix --
  app.setGlobalPrefix('api/v1');

  // -- Validation --
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // -- Swagger / OpenAPI --
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('LinkEduVN API')
      .setDescription(
        'Vietnam B2B2C Training Ecosystem API — CTĐT per QĐ788/2020, NĐ61/2024, TT02/2021',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'JWT',
      )
      .addTag('Auth')
      .addTag('Users')
      .addTag('Schools')
      .addTag('Enterprises')
      .addTag('Programs (CTĐT)')
      .addTag('Learners')
      .addTag('Enrollments')
      .addTag('Practice Records')
      .addTag('Evaluations')
      .addTag('Placements')
      .addTag('MOA')
      .addTag('Invoices')
      .addTag('Documents')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
    });
    SwaggerModule.setup('/api/v1/docs', app, document, {
      explorer: true,
      swaggerOptions: { persistAuthorization: true },
    });
    console.log('📚 Swagger docs → http://localhost:3000/api/v1/docs');
  }

  const PORT = Number(process.env.PORT) ?? 3000;
  await app.listen(PORT);
  console.log(`🚀 LinkEduVN API running at http://localhost:${PORT}/api/v1`);
}

bootstrap();
