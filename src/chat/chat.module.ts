import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Chat,
  ChatSchema,
  Message,
  MessageSchema,
} from './entities/chat.entity';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Chat.name,
        useFactory: () => {
          const schema = ChatSchema;
          return schema;
        },
      },
      {
        name: Message.name,
        useFactory: () => {
          const schema = MessageSchema;
          return schema;
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
