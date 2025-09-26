import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from "express";

import { AppModule } from './src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from 'src/config/exceptions/mongo-exception-filter.exception';
import { setupSwagger } from 'src/config/swagger/init';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    nestApp.useGlobalPipes(
    new ValidationPipe({
        whitelist: true, 
        forbidNonWhitelisted: true, 
        transform: true, 
    }),
    );

    nestApp.useGlobalFilters(new MongoExceptionFilter());
    
    setupSwagger(nestApp);

    nestApp.enableCors();

    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();

  return server(event, context, callback);
};