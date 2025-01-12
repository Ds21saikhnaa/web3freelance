import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Social } from '../entities/user.entity';

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
  @IsString({ message: 'The description must be a string' })
  description: string;

  @ApiProperty({ type: [String] })
  job_roles: string[];

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({ type: [Social] })
  contacts?: Social[] | null;
}
