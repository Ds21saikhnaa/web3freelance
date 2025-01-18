import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Social } from '../entities/user.entity';

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

  @ApiProperty({ type: [Social] })
  contacts?: Social[] | null;
}
