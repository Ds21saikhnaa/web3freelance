import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AcceptOffer } from '../accept-offer/entities/accept-offer.entity';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(AcceptOffer.name)
    private offerModel: Model<AcceptOffer>,
  ) {}

  async login(web3address: string) {
    const user = new this.userModel({ web3address });
    await user.save();
    return user;
  }

  async findAll(query: QueryDto) {
    const {
      sort = '-createdAt',
      page = 1,
      limit = 10,
      category,
      skills,
      minBudget,
      maxBudget,
    } = query;
    // Remove unwanted keys from the query
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(
        ([key]) =>
          ![
            'select',
            'sort',
            'page',
            'limit',
            'search',
            'category',
            'minBudget',
            'maxBudget',
          ].includes(key),
      ),
    );

    // Build search options
    const options: Record<string, any> = {
      ...filteredQuery,
    };

    // Add category filter if provided
    if (category) {
      options.job_roles = { $in: category };
    }

    if (skills) {
      options.skills = { $in: skills };
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      options.gig_budget = {};
      if (minBudget !== undefined) options.budget.$gte = Number(minBudget);
      if (maxBudget !== undefined) options.budget.$lte = Number(maxBudget);
    }
    const skip = (page - 1) * limit;

    const totalUsers = await this.userModel.countDocuments(options);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await this.userModel
      .find(options)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return { users, totalPage: totalPages };
  }

  async me(sub: string) {
    const user = await this.userModel.findOne({ _id: sub });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findOne(sub: string) {
    const user = await this.userModel.findOne({ _id: sub });
    if (!user) {
      throw new NotFoundException(`User with ID ${sub} not found`);
    }
    const jobs = await this.offerModel
      .find(
        {
          freelancer: sub,
          'review.rating': { $gt: 0 },
        },
        'job freelancer offerAmount review',
      )
      .populate({
        path: 'job',
        select: 'client',
        populate: { path: 'client', select: 'badges profile userName' },
      })
      .exec();
    return { user, reviews: jobs };
  }

  async findOneWeb3(address: string) {
    const user = await this.userModel.findOne({ web3address: address });
    return user;
  }

  async update(sub: string, updateUserDto: UpdateUserDto) {
    const user = await this.me(sub);
    Object.assign(user, updateUserDto);
    await user.save();
    return user;
  }

  async updateRating(sub: string) {
    const user = await this.me(sub);
    const acceptOffers = await this.offerModel.find({
      freelancer: sub,
      'review.rating': { $gt: 0 },
    });

    const totalReviews = acceptOffers.length;
    const totalRating = acceptOffers.reduce(
      (sum, offer) => sum + offer.review.rating,
      0,
    );
    const newRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    user.reviewCount = totalReviews;
    user.rating = newRating;
    await user.save();
    return true;
  }
}
