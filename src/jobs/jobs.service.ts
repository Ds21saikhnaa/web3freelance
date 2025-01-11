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

  async createJob(web3address: string, dto: JobInput) {
    const job = new this.jobModel({
      client: web3address,
      ...dto,
    });

    await job.save();
    return job;
  }
}
