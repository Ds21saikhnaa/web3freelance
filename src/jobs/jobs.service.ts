import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobInput } from './dto/create-job.dto';
import { Job } from './entities/jobs.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
  ) {}

  async createJob(sub: string, dto: JobInput) {
    const job = new this.jobModel({
      client: sub,
      ...dto,
    });

    await job.save();
    return job;
  }

  async getJobs(query: Record<string, any>) {
    const {
      sort = '-createdAt',
      page = 1,
      limit = 10,
      search,
      category,
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
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return { jobs, totalPage: totalPages };
  }

  async getMeJobs(userId: string, query: Record<string, any>) {
    const { sort = '-createdAt', page = 1, limit = 10 } = query;
    // Remove unwanted keys from the query
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(
        ([key]) => !['select', 'sort', 'page', 'limit'].includes(key),
      ),
    );

    // Build search options
    const options: Record<string, any> = {
      client: userId,
      ...filteredQuery,
    };

    // Add search filters if provided
    const skip = (page - 1) * limit;

    const totalJobs = await this.jobModel.countDocuments(options);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await this.jobModel
      .find(
        options,
        'name description gig_budget bids duration_time requirement',
      )
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return { jobs, totalPage: totalPages };
  }
}
