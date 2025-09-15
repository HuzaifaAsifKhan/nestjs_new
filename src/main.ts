import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { timestamp } from 'rxjs';

async function bootstrap() {
  const logger = new Logger('bootstrap', { timestamp: true });
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  logger.log('Application runs successfully');
}
bootstrap();
