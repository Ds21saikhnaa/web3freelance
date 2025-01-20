import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({})
  @IsString({ message: 'The userName must be a string' })
  userName: string;

  @ApiProperty({})
  @IsString({ message: 'The bio must be a string' })
  bio: string;

  @ApiProperty({})
  @IsNumber()
  budget: number;

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
