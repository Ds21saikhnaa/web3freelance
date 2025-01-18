import { Module } from '@nestjs/common';
import { AcceptOfferService } from './accept-offer.service';
import { AcceptOfferController } from './accept-offer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AcceptOffer, AcceptOfferSchema } from './entities/accept-offer.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: AcceptOffer.name,
        useFactory: () => {
          const schema = AcceptOfferSchema;
          return schema;
        },
      },
    ]),
    UsersModule,
  ],
  controllers: [AcceptOfferController],
  providers: [AcceptOfferService],
  exports: [AcceptOfferService],
})
export class AcceptOfferModule {}
