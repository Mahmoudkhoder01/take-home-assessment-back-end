import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cors = {
    origin: ['http://localhost:3000'],
    method: 'GET, POST, PUT, DELETE, HEAD, OPTIONS',
  };

  app.enableCors(cors);

  await app.listen(5000);
}
bootstrap();
