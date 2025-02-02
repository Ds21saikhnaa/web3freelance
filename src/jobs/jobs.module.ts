import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema, Job, JobSchema } from './entities/jobs.entity';
import { UsersModule } from '../users/users.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Job.name,
        useFactory: () => {
          const schema = JobSchema;
          return schema;
        },
      },
      {
        name: Bid.name,
        useFactory: () => {
          const schema = BidSchema;
          return schema;
        },
      },
    ]),
    UsersModule,
    ChatModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
