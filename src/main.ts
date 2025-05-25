/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors: true});
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties not in DTOs
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties
    transform: true, // Auto-transform payloads to DTO instances
  }));
  
  await app.listen(process.env.PORT || 5002);
}
bootstrap();
