import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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
  @ApiProperty({
    default: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
  })
  @IsNotEmpty({ message: 'The web3address is required' })
  @IsString({ message: 'The web3address must be a string' })
  web3address: string;
}

export class SignatureInput {
  @ApiProperty({
    default: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
  })
  @IsNotEmpty({ message: 'The web3address is required' })
  @IsString({ message: 'The web3address must be a string' })
  web3address: string;

  @ApiProperty({})
  @IsString({ message: 'The signature must be a string' })
  signature: string;
}

export class ReviewDto {
  @ApiProperty({ required: true })
  @Min(0)
  @Max(5)
  @IsNumber()
  rating: number;

  @ApiProperty({ required: true })
  @IsString()
  comment: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  job: string;
}
