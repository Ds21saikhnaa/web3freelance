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
import { CreateBidDto, JobInput, ReqJobInput } from './dto/create-job.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryDto } from './dto/query.dto';
import { PaginationDto } from '../utils';

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

  @ApiBearerAuth()
  @Post('offer')
  @UseGuards(AuthGuard('jwt'))
  createOfferJob(@Request() req: any, @Body() dto: ReqJobInput) {
    const { sub } = req.user;
    return this.jobsService.createOfferJob(sub, dto);
  }

  @Get('')
  getTasks(@Query() query: QueryDto) {
    return this.jobsService.getJobs(query);
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }

  @Get('bid/:id')
  getBid(@Param('id') id: string) {
    return this.jobsService.getBid(id);
  }

  @ApiBearerAuth()
  @Get('all/me')
  @UseGuards(AuthGuard('jwt'))
  getMeTasks(@Request() req: any, @Query() query: PaginationDto) {
    const { sub } = req.user;
    return this.jobsService.getMeJobs(sub, query);
  }

  @ApiBearerAuth()
  @Get('get-offer/me')
  @UseGuards(AuthGuard('jwt'))
  getMeOffer(@Request() req: any) {
    const { sub } = req.user;
    return this.jobsService.getMeOffer(sub);
  }

  @ApiBearerAuth()
  @Get('send-offer/me')
  @UseGuards(AuthGuard('jwt'))
  sendMeOffer(@Request() req: any) {
    const { sub } = req.user;
    return this.jobsService.sendMeOffer(sub);
  }

  @ApiBearerAuth()
  @Get('bids/me')
  @UseGuards(AuthGuard('jwt'))
  meBids(@Request() req: any) {
    const { sub } = req.user;
    return this.jobsService.meBids(sub);
  }

  @ApiBearerAuth()
  @Post('rollback/:hash')
  @UseGuards(AuthGuard('jwt'))
  roleBack(@Param('hash') hash: string) {
    return this.jobsService.roleBack(hash);
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

  @ApiBearerAuth()
  @Post(':id/accept-bid/:bidId')
  @UseGuards(AuthGuard('jwt'))
  acceptBid(
    @Request() req: any,
    @Param('id') id: string,
    @Param('bidId') bidId: string,
  ) {
    const { sub } = req.user;
    return this.jobsService.acceptBid(id, sub, bidId);
  }
}
