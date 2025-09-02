import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/init';
import passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './config/exceptions/mongo-exception-filter.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  app.useGlobalFilters(new MongoExceptionFilter());
  
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
