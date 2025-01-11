import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export interface SocialType {
  platform: string;
  link: string;
}

export interface SkillType {
  name: string;
}

export class SocialInput {
  @ApiProperty({})
  @IsString({ message: 'The platform must be a string' })
  platform: string;

  @ApiProperty({})
  @IsString({ message: 'The link must be a string' })
  link: string;
}

export class SkillInput {
  @ApiProperty({})
  @IsString({ message: 'The name must be a string' })
  name: string;
}

export class LoginInput {
  @ApiProperty({})
  @IsNotEmpty({ message: 'The web3address is required' })
  @IsString({ message: 'The web3address must be a string' })
  web3address: string;
}
