import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAcceptOfferDto, ReviewDto } from './dto/create-accept-offer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { AcceptOffer } from './entities/accept-offer.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AcceptOfferService {
  constructor(
    @InjectModel(AcceptOffer.name)
    private offerModel: Model<AcceptOffer>,
    private readonly userService: UsersService,
  ) {}

  async create(
    createAcceptOfferDto: CreateAcceptOfferDto,
    session: ClientSession,
  ) {
    const offer = new this.offerModel(createAcceptOfferDto);
    await offer.save({ session });
    return offer;
  }

  async addReview(sub: string, offerId: string, review: ReviewDto) {
    const offer = await this.offerModel
      .findById(offerId)
      .populate('job')
      .exec();
    if (!offer) {
      throw new Error('Offer not found');
    }
    if (offer.job['client'].toString() !== sub) {
      throw new ForbiddenException('Forbidden');
    }
    offer.review = review;
    await offer.save();
    await this.userService.updateRating(offer.freelancer.toString());
    return offer;
  }
}
