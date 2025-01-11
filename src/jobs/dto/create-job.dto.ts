import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class JobInput {
  @ApiProperty({})
  @IsNotEmpty({ message: 'The title is required' })
  @IsString({ message: 'The title must be a string' })
  title: string;

  @ApiProperty({})
  @IsString({ message: 'The description must be a string' })
  description: string;

  @ApiProperty({})
  @IsString({ message: 'The delivery time must be a string' })
  delivery_time: string;

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
  requirementSkills?: string[];

  @ApiProperty({})
  @IsNumber()
  gig_amount: number;
}
