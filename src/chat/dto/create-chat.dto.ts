import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({})
  @IsMongoId({ message: 'the toUser must be a mongoid' })
  toUser: string;
}

export class CreateMessageDto {
  @ApiProperty({})
  @IsMongoId()
  chatId: string;

  @ApiProperty({})
  @IsString({ message: 'The message must be a string' })
  message: string;
}
