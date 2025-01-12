import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
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
    const { sub } = req.user;
    return this.jobsService.createJob(sub, dto);
  }

  @Get('')
  getTasks(@Query() query: Record<string, any>) {
    return this.jobsService.getJobs(query);
  }
}
