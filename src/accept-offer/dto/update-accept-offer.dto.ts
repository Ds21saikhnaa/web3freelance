import { PartialType } from '@nestjs/swagger';
import { CreateAcceptOfferDto } from './create-accept-offer.dto';

export class UpdateAcceptOfferDto extends PartialType(CreateAcceptOfferDto) {}
