// import { PartialType } from '@nestjs/swagger';

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Social } from '../entities/user.entity';
import { Role } from '../enum';

export class UpdateUserDto {
  @ApiProperty({})
  @IsString({ message: 'The firstName must be a string' })
  firstName: string;

  @ApiProperty({})
  @IsString({ message: 'The lastName must be a string' })
  lastName: string;

  @ApiProperty({})
  @IsString({ message: 'The userName must be a string' })
  userName: string;

  @ApiProperty({})
  @IsEnum(Role)
  @IsString({ message: 'The role must be a string' })
  role: Role;

  @ApiProperty({})
  @IsString({ message: 'The description must be a string' })
  description: string;

  @ApiProperty({ type: [String] })
  job_roles: string[];

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({ type: [Social] })
  contacts?: Social[] | null;
}
