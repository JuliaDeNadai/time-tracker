
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .addApiKey(
            {
                type: 'apiKey',
                name: 'x-access-token',
                in: 'header',
                description: 'JWT (CloudFront OAC uses Authorization for SigV4)',
            },
            'x-access-token',
        )
        .addBearerAuth()
        .setTitle('Time-Tracker')
        .setDescription('API to help autonomous workers to track their work time')
        .setVersion('1.0')
        .addServer(`${process.env.LAMBDA_URL ?? 'http://localhost:3000'}`)
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/swagger', app, document);

}
