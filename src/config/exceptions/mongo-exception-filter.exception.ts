import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    console.log(exception)
    if (exception.code === 11000) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      return response
        .status(409)
        .json({ message: 'Duplicidade detectada: registro já existe.' });
    }

    throw exception;
  }
}
