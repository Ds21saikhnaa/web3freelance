import { Injectable } from '@nestjs/common';
import { CreateAcceptOfferDto } from './dto/create-accept-offer.dto';
import { UpdateAcceptOfferDto } from './dto/update-accept-offer.dto';

@Injectable()
export class AcceptOfferService {
  create(createAcceptOfferDto: CreateAcceptOfferDto) {
    return 'This action adds a new acceptOffer';
  }

  findAll() {
    return `This action returns all acceptOffer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} acceptOffer`;
  }

  update(id: number, updateAcceptOfferDto: UpdateAcceptOfferDto) {
    return `This action updates a #${id} acceptOffer`;
  }

  remove(id: number) {
    return `This action removes a #${id} acceptOffer`;
  }
}
