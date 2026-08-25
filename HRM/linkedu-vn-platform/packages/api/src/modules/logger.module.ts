import { Module, Logger } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: Logger,
      useValue: new Logger('LinkEdu'),
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
