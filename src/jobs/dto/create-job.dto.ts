import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PricePackage } from '../../users/enum';

export class JobInput {
  @ApiProperty({})
  @IsNotEmpty({ message: 'The title is required' })
  @IsString({ message: 'The title must be a string' })
  title: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  description: string;

  @ApiProperty({})
  @IsString({ message: 'The delivery time must be a string' })
  duration_time: string;

  @ApiProperty({})
  @IsString({ message: 'The main category must be a string' })
  main_category: string;

  @ApiProperty({})
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiProperty({})
  @IsArray()
  @IsOptional()
  requirement: string[];

  @ApiProperty({})
  @IsNumber()
  gig_budget: number;

  @ApiProperty({})
  @IsNumber()
  bid_week: number;
}

export class ReqJobInput {
  @ApiProperty({})
  @IsMongoId()
  userId: string;

  @ApiProperty({})
  type: PricePackage;

  @ApiProperty({})
  @IsString({ message: 'The delivery time must be a string' })
  duration_time: string;

  @ApiProperty({})
  @IsNumber()
  bid_week: number;
}

export class CreateBidDto {
  @ApiProperty({})
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  duration_time: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  description: string;
}
