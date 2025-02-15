import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AcceptOfferService } from './accept-offer.service';
import { ReviewDto } from './dto/create-accept-offer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Offer')
@Controller('offer')
export class AcceptOfferController {
  constructor(private readonly acceptOfferService: AcceptOfferService) {}

  @ApiBearerAuth()
  @Post('review/:id')
  @UseGuards(AuthGuard('jwt'))
  addReview(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ReviewDto,
  ) {
    const { sub } = req.user;
    return this.acceptOfferService.addReview(sub, id, dto);
  }

  @ApiBearerAuth()
  @Get('reportMe')
  @UseGuards(AuthGuard('jwt'))
  reportMe(@Request() req: any) {
    const { sub } = req.user;
    return this.acceptOfferService.reportMe(sub);
  }

  @ApiBearerAuth()
  @Get('reviewMe')
  @UseGuards(AuthGuard('jwt'))
  reviewMe(@Request() req: any) {
    const { sub } = req.user;
    return this.acceptOfferService.reviewMe(sub);
  }
}
