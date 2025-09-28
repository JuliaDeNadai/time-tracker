
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Time-Tracker')
        .setDescription('API to help autonomous workers to track their work time')
        .setVersion('1.0')
        .addServer('http://localhost:3000')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/swagger', app, document);

}