import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAcceptOfferDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'The job is required' })
  @IsMongoId()
  job: string | Types.ObjectId;

  @ApiProperty({})
  @IsNotEmpty({ message: 'The freelancer is required' })
  @IsMongoId()
  freelancer: string | Types.ObjectId;

  @ApiProperty({})
  @IsNumber()
  offerAmount: number;
}

export class ReviewDto {
  @ApiProperty({})
  @IsNumber()
  rating: number;

  @ApiProperty({})
  @IsString()
  comment: string;
}
