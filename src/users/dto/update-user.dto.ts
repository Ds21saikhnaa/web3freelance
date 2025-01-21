import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class BudgetType {
  @ApiProperty({ description: 'The amount for the budget' })
  @IsNumber({}, { message: 'The amount must be a number' })
  amount: number;

  @ApiProperty({ description: 'The day of the budget' })
  @IsString({ message: 'The day must be a string' })
  day: string;

  @ApiProperty({ description: 'The description of the budget' })
  @IsString({ message: 'The description must be a string' })
  description: string;
}

export class UpdateUserDto {
  @ApiProperty({})
  @IsString({ message: 'The userName must be a string' })
  userName: string;

  @ApiProperty({})
  @IsString({ message: 'The bio must be a string' })
  bio: string;

  @ApiProperty({})
  @ValidateNested()
  budget: BudgetType;

  @ApiProperty({ type: [String] })
  job_roles: string[];

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({})
  @IsString({ message: 'The bio must be a string' })
  twitter: string;

  @ApiProperty({})
  @IsString({ message: 'The bio must be a string' })
  email: string;
}
