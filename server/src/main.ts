import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
    ],
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
