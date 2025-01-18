import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({})
  @IsMongoId()
  parent?: string;

  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  icon?: string;
}
