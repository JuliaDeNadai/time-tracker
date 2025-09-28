import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Handler, Context, APIGatewayProxyEvent } from "aws-lambda";
import express from "express";

import { AppModule } from './src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from 'src/config/exceptions/mongo-exception-filter.exception';
import { setupSwagger } from 'src/config/swagger/init';

let invocationCount = 0;
let currentMinute = new Date().getUTCMinutes();
const LIMIT_PER_MINUTE = process.env.LIMIT_PER_MINUTE;

let cachedServer: ReturnType<typeof serverlessExpress>;

async function bootstrap() {
  if (!cachedServer) {
    console.log('nao tem cached server')
    const expressApp = express();
    console.log('express')
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    console.log('nest app')

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    nestApp.useGlobalFilters(new MongoExceptionFilter());
    setupSwagger(nestApp);
    console.log('setup swagger')
    nestApp.enableCors();
    await nestApp.init();
    console.log('nest app init')

    cachedServer = serverlessExpress({ app: expressApp });
    console.log('cacheou o server')
  }

  return cachedServer;
}

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
    const now = new Date();
  const minute = now.getUTCMinutes();

  // ✅ Se mudou de minuto, resetamos o contador
  if (minute !== currentMinute) {
    currentMinute = minute;
    invocationCount = 0;
  }

  invocationCount++;

  // ✅ Verifica se o limite foi atingido
  if (invocationCount > LIMIT_PER_MINUTE) {
    console.warn(`Limite de ${LIMIT_PER_MINUTE} ativações por minuto excedido.`);
    return {
      statusCode: 429,
      body: JSON.stringify({ message: 'Limite de ativações da Lambda por minuto excedido.' }),
    };
  }

  const server = await bootstrap();
  console.log('Iniciou')
  return server(event, context);
};