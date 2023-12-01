import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as fs from 'fs/promises';

async function bootstrap() {
  try {
    await fs.readdir('./uploads');
  } catch (e) {
    await fs.mkdir('./uploads');
    await fs.mkdir('./uploads/images');
    await fs.mkdir('./uploads/images/thumbs');
    await fs.mkdir('./uploads/videos');
    await fs.mkdir('./uploads/videos/workout');
    await fs.mkdir('./uploads/videos/origin');
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
