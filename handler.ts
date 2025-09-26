import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Handler, Context, APIGatewayProxyEvent } from "aws-lambda";
import express from "express";

import { AppModule } from './src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from 'src/config/exceptions/mongo-exception-filter.exception';
import { setupSwagger } from 'src/config/swagger/init';

let cachedServer: ReturnType<typeof serverlessExpress>;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    console.log('Server created');

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    nestApp.useGlobalFilters(new MongoExceptionFilter());
    setupSwagger(nestApp);
    console.log('Swagger created');
    nestApp.enableCors();
    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

/* const RATE_LIMIT = 2;
const cache = new Map<string, { count: number; reset: number }>(); */
export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  /* try{
    const ip = event.requestContext?.http?.sourceIp || 'unknown';
    const now = Date.now();
    
    if (!cache.has(ip)) {
      cache.set(ip, { count: 1, reset: now + 60_000 });
    } else {
      const entry = cache.get(ip)!;
      if (now > entry.reset) {
        entry.count = 1;
        entry.reset = now + 60_000;
      } else {
        entry.count += 1;
        if (entry.count > RATE_LIMIT) {
          return { statusCode: 429, body: 'Too many requests' };
        }
      }
    }
    
  } catch(err){
      console.log(err)
      return { statusCode: 500, body: 'Error occurred' };
  } */
  
  const server = await bootstrap();
  return server(event, context);
};