import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-session-secret',
      resave: false,
      saveUninitialized: false, 
      cookie: { secure: process.env.NODE_ENV === 'production' },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
