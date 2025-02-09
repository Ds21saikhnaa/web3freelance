import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ImageLocation } from '../enum';

export class UploadImageDto {
  @ApiProperty({ description: 'Event name for filtering' })
  @IsEnum(ImageLocation)
  location: ImageLocation;
}
