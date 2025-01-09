import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './entities/jobs.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
  ) {}

  async createJob(dto: any) {
    const job = new this.jobModel({
      description: 'ene ih goy ajil shu sda min',
      owner: '',
    });

    await job.save();
    return job;
  }
}
