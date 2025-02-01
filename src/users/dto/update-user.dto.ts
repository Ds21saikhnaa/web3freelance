import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PricePackage } from '../enum';

class BudgetType {
  @ApiProperty()
  type: PricePackage;

  @ApiProperty({ description: 'The amount for the budget' })
  @IsNumber({}, { message: 'The amount must be a number' })
  amount: number;

  @ApiProperty({ description: 'The day of the budget' })
  @IsNumber()
  day: number;

  @ApiProperty({ type: [String] })
  @IsString({ message: 'The description must be a string' })
  description: string[];
}

export class UpdateUserDto {
  @ApiProperty({})
  @IsString({ message: 'The userName must be a string' })
  userName: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  bio: string;

  @ApiProperty({
    type: [BudgetType],
    description: 'The budget details (max 3 budgets allowed)',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMaxSize(3, { message: 'You can create a maximum of 3 budgets.' })
  budget: BudgetType[];

  @ApiProperty({ type: [String] })
  job_roles: string[];

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({ type: [String] })
  selected_badges: string[];

  @ApiProperty({})
  @IsString({ message: 'The bio must be a string' })
  twitter: string;

  @ApiProperty({})
  @IsString({ message: 'The bio must be a string' })
  email: string;
}
