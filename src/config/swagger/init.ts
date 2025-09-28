
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Time-Tracker')
        .setDescription('API to help autonomous workers to track their work time')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      urls: [
        {
          url: process.env.LAMBDA_URL, 
          name: 'Lambda URL',
        },
      ],
    },
  });

}