import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { IsString } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {}

export class UpdateMessageDto {
  @ApiProperty({})
  @IsString({ message: 'The message must be a string' })
  message: string;
}
