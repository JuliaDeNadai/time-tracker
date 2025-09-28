import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceSchema } from './services.schema';
import { UserSchema } from '../users/users.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Services', schema: ServiceSchema },
        { name: 'User', schema: UserSchema }
    ]),
    ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService]
})
export class ServicesModule {}
