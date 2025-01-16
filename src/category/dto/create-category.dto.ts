import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;

  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  icon?: string;
}
