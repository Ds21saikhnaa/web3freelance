import { Module } from '@nestjs/common';
import { AcceptOfferService } from './accept-offer.service';
import { AcceptOfferController } from './accept-offer.controller';

@Module({
  controllers: [AcceptOfferController],
  providers: [AcceptOfferService]
})
export class AcceptOfferModule {}
