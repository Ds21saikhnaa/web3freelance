import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAcceptOfferDto, ReviewDto } from './dto/create-accept-offer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { AcceptOffer } from './entities/accept-offer.entity';
import { UsersService } from '../users/users.service';
import { JobStatus } from '../jobs/enum';

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

  async reportMe(sub: string) {
    const user = await this.userService.me(sub);
    const paidAgg = [
      {
        $match: {
          freelancer: user._id,
          jobStatus: JobStatus.Paid,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$offerAmount' },
          total: { $sum: 1 },
        },
      },
    ];
    const pengingAgg = [
      {
        $match: {
          freelancer: user._id,
          jobStatus: JobStatus.Assigned,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$offerAmount' },
          total: { $sum: 1 },
        },
      },
    ];
    const [paidOffers, pendingOffers] = await Promise.all([
      this.offerModel.aggregate(paidAgg),
      this.offerModel.aggregate(pengingAgg),
    ]);

    return {
      paidOffers:
        paidOffers.length > 0 ? paidOffers[0] : { totalAmount: 0, total: 0 },
      pendingOffers:
        pendingOffers.length > 0
          ? pendingOffers[0]
          : { totalAmount: 0, total: 0 },
      rating: user.rating || 0,
    };
  }

  async reviewMe(sub: string) {
    const user = await this.userService.me(sub);
    return await this.offerModel
      .find(
        {
          freelancer: user._id,
          'review.rating': { $gt: 0 },
        },
        'review job',
      )
      .populate({
        path: 'client',
        select: 'web3address profile userName reviewCount',
      })
      .exec();
  }
}
