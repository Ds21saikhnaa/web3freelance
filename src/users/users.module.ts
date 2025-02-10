import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import {
  AcceptOffer,
  AcceptOfferSchema,
} from '../accept-offer/entities/accept-offer.entity';
import { Job, JobSchema } from '../jobs/entities/jobs.entity';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        },
      },
      {
        name: AcceptOffer.name,
        useFactory: () => {
          const schema = AcceptOfferSchema;
          return schema;
        },
      },
      {
        name: Job.name,
        useFactory: () => {
          const schema = JobSchema;
          return schema;
        },
      },
    ]),
    HttpModule,
    ImageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
