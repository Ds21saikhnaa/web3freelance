import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AcceptOffer } from '../accept-offer/entities/accept-offer.entity';
import { QueryDto } from './dto/query.dto';
import { Job } from '../jobs/entities/jobs.entity';
import { JobStatus } from '../jobs/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(AcceptOffer.name)
    private offerModel: Model<AcceptOffer>,
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
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
      userName: { $exists: true },
      $expr: { $gt: [{ $size: '$job_roles' }, 0] },
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
      options['budget.amount'] = {};

      if (minBudget !== undefined)
        options['budget.amount'].$gte = Number(minBudget);

      if (maxBudget !== undefined)
        options['budget.amount'].$lte = Number(maxBudget);
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
    const user = await this.userModel
      .findById(sub)
      .populate('saved_jobs')
      .exec();

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

  async saveJob(sub: string, jobId: string) {
    const user = await this.me(sub);
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not fount');
    }
    if (job.client.toString() === sub) {
      throw new BadRequestException('This job is your job');
    }
    if (job.status !== JobStatus.Open) {
      throw new BadRequestException('This job not open');
    }
    const savedJob = await this.userModel.findOne({
      _id: sub,
      saved_jobs: { $in: jobId },
    });
    if (savedJob) {
      throw new BadRequestException('you already saved this job');
    }
    user.saved_jobs.push(jobId as any);
    await user.save();
    return user;
  }

  async removeJob(sub: string, jobId: string) {
    const user = await this.me(sub);
    const updateResult = await this.userModel.updateOne(
      { _id: sub },
      { $pull: { saved_jobs: jobId } },
    );

    if (updateResult.modifiedCount === 0) {
      throw new BadRequestException('Job not found in saved jobs');
    }
    return !!user;
  }
}
