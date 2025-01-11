import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JobInput } from './dto/create-job.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Job')
@Controller('job')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiBearerAuth()
  @Post('')
  @UseGuards(AuthGuard('jwt'))
  createTask(@Request() req: any, @Body() dto: JobInput) {
    const { web3address } = req.user;
    return this.jobsService.createJob(web3address, dto);
  }
}
