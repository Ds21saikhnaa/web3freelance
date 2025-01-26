import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema, Job, JobSchema } from './entities/jobs.entity';
// import { AcceptOfferModule } from '../accept-offer/accept-offer.module';

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
    // AcceptOfferModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
