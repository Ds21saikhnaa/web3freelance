import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AcceptOfferService } from './accept-offer.service';
import { CreateAcceptOfferDto } from './dto/create-accept-offer.dto';
import { UpdateAcceptOfferDto } from './dto/update-accept-offer.dto';

@Controller('accept-offer')
export class AcceptOfferController {
  constructor(private readonly acceptOfferService: AcceptOfferService) {}

  @Post()
  create(@Body() createAcceptOfferDto: CreateAcceptOfferDto) {
    return this.acceptOfferService.create(createAcceptOfferDto);
  }

  @Get()
  findAll() {
    return this.acceptOfferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acceptOfferService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAcceptOfferDto: UpdateAcceptOfferDto,
  ) {
    return this.acceptOfferService.update(+id, updateAcceptOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acceptOfferService.remove(+id);
  }
}
