import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateBidDto, JobInput } from './dto/create-job.dto';
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

  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMeTasks(@Request() req: any, @Query() query: Record<string, any>) {
    const { sub } = req.user;
    return this.jobsService.getMeJobs(sub, query);
  }

  @ApiBearerAuth()
  @Post(':id/bid')
  @UseGuards(AuthGuard('jwt'))
  createBid(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateBidDto,
  ) {
    const { sub } = req.user;
    return this.jobsService.addBid(id, sub, dto);
  }
}
