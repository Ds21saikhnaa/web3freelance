import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PricePackage } from '../../users/enum';
import { DateEnum } from '../../utils';

export class DateInput {
  @ApiProperty({})
  @IsNumber()
  duration_time: number;

  @ApiProperty()
  duration_time_type: DateEnum;
}

export class JobInput extends DateInput {
  @ApiProperty({})
  @IsNotEmpty({ message: 'The title is required' })
  @IsString({ message: 'The title must be a string' })
  title: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  description: string;

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

export class ReqJobInput extends DateInput {
  @ApiProperty({})
  @IsMongoId()
  userId: string;

  @ApiProperty({})
  type: PricePackage;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  description: string;

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
  @IsNumber()
  @IsOptional()
  duration_time: number;

  @ApiProperty({})
  @IsEnum(DateEnum)
  @IsOptional()
  duration_time_type: DateEnum;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  description: string;
}
