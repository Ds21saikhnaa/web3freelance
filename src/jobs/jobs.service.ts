import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBidDto, JobInput, ReqJobInput } from './dto/create-job.dto';
import { Bid, Job } from './entities/jobs.entity';
import { JobStatus } from './enum';
// import { AcceptOfferService } from '../accept-offer/accept-offer.service';
// import { CreateAcceptOfferDto } from '../accept-offer/dto/create-accept-offer.dto';
import { QueryDto } from './dto/query.dto';
import { decrypt, encrypt, PaginationDto } from '../utils';
import { UsersService } from '../users/users.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
    @InjectModel(Bid.name)
    private bidModel: Model<Bid>,
    private readonly userService: UsersService,
    // private readonly offerService: AcceptOfferService,
  ) {}

  async createJob(sub: string, dto: JobInput) {
    const { bid_week } = dto;
    delete dto.bid_week;
    const job = new this.jobModel({
      client: sub,
      bid_day_end: new Date(Date.now() + bid_week * 7 * 24 * 60 * 60 * 1000),
      ...dto,
    });

    await job.save();
    return job;
  }

  async createOfferJob(sub: string, dto: ReqJobInput) {
    const { bid_week, userId, type, duration_time } = dto;
    const user = await this.userService.me(userId);
    if (!user.budget.length) {
      new BadRequestException('tier not found');
    }
    const tier = user.budget.find((el) => el.type === type);
    delete dto.bid_week;
    const job = new this.jobModel({
      title: type,
      description: tier.description,
      main_category: user.job_roles[0] || '',
      categories: [],
      requirement: user.skills,
      client: sub,
      duration_time,
      gig_budget: tier.amount,
      req: user._id,
      bid_day_end: new Date(Date.now() + bid_week * 7 * 24 * 60 * 60 * 1000),
    });

    await job.save();
    return job;
  }

  async getJobs(query: QueryDto) {
    const {
      sort = '-createdAt',
      page = 1,
      limit = 10,
      search,
      category,
      minBudget,
      maxBudget,
    } = query;

    // Build search options
    const options: Record<string, any> = {
      status: JobStatus.Open,
    };

    // Add search filters if provided
    if (search) {
      options.$or = [
        { description: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') },
      ];
    }

    // Add category filter if provided
    if (category) {
      options.main_category = category;
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      options.gig_budget = {};
      if (minBudget !== undefined) options.gig_budget.$gte = Number(minBudget);
      if (maxBudget !== undefined) options.gig_budget.$lte = Number(maxBudget);
    }
    const skip = (page - 1) * limit;

    const totalJobs = await this.jobModel.countDocuments(options);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await this.jobModel
      .find(options)
      .populate({ path: 'bids', select: 'user' })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return { jobs, totalPage: totalPages };
  }

  async getMeJobs(userId: string, query: PaginationDto) {
    const { sort = '-createdAt', page = 1, limit = 10 } = query;

    // Build search options
    const options: Record<string, any> = {
      client: userId,
    };

    // Add search filters if provided
    const skip = (page - 1) * limit;

    const totalJobs = await this.jobModel.countDocuments(options);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await this.jobModel
      .find(
        options,
        'title description gig_budget bids duration_time bid_day_end requirement status',
      )
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'bids',
        populate: { path: 'user' },
      })
      .exec();

    return { jobs, totalPage: totalPages };
  }

  async getJob(id: string) {
    const job = await this.jobModel
      .findById(id)
      .populate('client', '-reward -job_roles -skills')
      .populate({
        path: 'bids', // Path to populate
        populate: { path: 'user', select: '-reward -job_roles -skills' },
      })
      .exec();
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const jobs = await this.jobModel
      .find({ _id: { $ne: id }, client: job.client }, 'title description')
      .sort('-createdAt')
      .limit(3)
      .exec();

    return { job, more: jobs };
  }

  async addBid(jobId: string, userId: string, createBidDto: CreateBidDto) {
    const job = await this.jobModel.findById(jobId).exec();

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }
    if (job.status !== JobStatus.Open) {
      throw new BadRequestException(`Job is not open`);
    }
    if (job.client.toString() === userId) {
      throw new BadRequestException(`This is your job`);
    }

    const bid = await this.bidModel.findOne({ user: userId, job: job._id });
    if (bid) throw new BadRequestException(`You already have a bid`);
    const now = new Date();
    if (now > job.bid_day_end) {
      throw new BadRequestException(
        `The bid date for this job creation has ended.`,
      );
    }
    const newBid = new this.bidModel({
      job: jobId,
      user: userId,
      bid_day_end: job.bid_day_end,
      ...createBidDto,
      isSelected: false,
    });

    const session = await this.bidModel.db.startSession();
    session.startTransaction();

    try {
      await newBid.save({ session });
      job.bids.push(newBid._id as any);
      await job.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(`Error saving bid: ${error.message}`);
    } finally {
      session.endSession();
    }
    return job;
  }

  async getBid(id: string) {
    const bid = await this.bidModel.findById(id);
    if (!bid) {
      throw new NotFoundException('Bid not found');
    }
    return bid;
  }

  async acceptBid(jobId: string, userId: string, bidId: string) {
    const job = await this.jobModel
      .findById(jobId)
      .populate({ path: 'client', select: 'web3address' })
      .exec();

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }
    if (job.status !== JobStatus.Open) {
      throw new BadRequestException(`Job is not open`);
    }

    if (job.client._id.toString() !== userId) {
      throw new BadRequestException(`This is not your job`);
    }

    const bid = await this.bidModel
      .findOne({ _id: bidId, job: job._id })
      .exec();
    if (!bid) throw new NotFoundException(`Bid not found`);

    bid.set('isSelected', true);
    const session = await this.bidModel.db.startSession();
    session.startTransaction();

    try {
      await bid.save({ session });
      job.status = JobStatus.Paid;
      job.first_budget = job.gig_budget;
      job.gig_budget = bid.amount;
      job.hash = encrypt(job);
      await job.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(`Error saving bid: ${error.message}`);
    } finally {
      session.endSession();
    }
    return job;
  }

  async roleBack(hash: string) {
    console.log(hash);
    const job = decrypt(hash);
    const { _id } = job;
    const sysJob = await this.jobModel.findById(_id);
    if (!sysJob) {
      throw new NotFoundException(`Job not found`);
    }
    sysJob.status = JobStatus.Open;
    sysJob.gig_budget = sysJob.first_budget;
    sysJob.hash = null;
    await sysJob.save();
    await this.bidModel.updateMany({ job: sysJob._id }, { isSelected: false });
    return sysJob;
  }

  async meBids(sub: string) {
    const now = new Date();
    const approvedBids = await this.bidModel
      .find({
        user: sub,
        isSelected: true,
      })
      .populate({
        path: 'job',
        select: 'title description bids main_category status bid_day_end',
        populate: { path: 'bids' },
      })
      .exec();
    const pendingBids = await this.bidModel
      .find({
        user: sub,
        bid_day_end: { $gte: now.getTime() },
        isSelected: false,
      })
      .populate({
        path: 'job',
        select: 'title description bids main_category status bid_day_end',
        populate: { path: 'bids' },
      })
      .exec();

    const expiredBids = await this.bidModel
      .find({
        user: sub,
        bid_day_end: { $lte: now.getTime() },
        isSelected: false,
      })
      .populate({
        path: 'job',
        select: 'title description main_category bids status bid_day_end',
        populate: { path: 'bids' },
      })
      .exec();

    return { approvedBids, pendingBids, expiredBids };
  }
}
