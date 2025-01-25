import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto, CreateMessageDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, Message } from './entities/chat.entity';
import { Model } from 'mongoose';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}
  async create(sub: string, createChatDto: CreateChatDto) {
    const { toUser } = createChatDto;
    if (toUser === sub) {
      throw new BadRequestException('Something went wrong');
    }
    const newChat = new this.chatModel({
      participants: [sub, toUser],
    });
    await newChat.save();
    return newChat;
  }

  async createMessage(sub: string, dto: CreateMessageDto) {
    const { chatId, message } = dto;
    const newMessage = new this.messageModel({
      sender: sub,
      chatId,
      message,
    });
    await newMessage.save();
    return newMessage;
  }

  async findMe(sub: string, query: QueryDto) {
    const { page = 1, sort = '-createdAt', limit = 10 } = query;
    const options: Record<string, any> = {
      participants: { $in: sub },
    };
    const skip = (page - 1) * limit;
    const totalChats = await this.chatModel.countDocuments(options);
    const totalPages = Math.ceil(totalChats / limit);
    const chats = await this.chatModel
      .find(options)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return { chats, totalPage: totalPages };
  }

  async findOne(id: string, sub: string) {
    const chat = await this.chatModel.findOne({
      _id: id,
      participants: { $in: sub },
    });
    if (!chat) {
      throw new NotFoundException(`Chat not found`);
    }
    return chat;
  }

  async findAllOneChat(id: string, sub: string, query: QueryDto) {
    const { page = 1, sort = '-createdAt', limit = 10 } = query;
    const chat = await this.findOne(id, sub);
    const options: Record<string, any> = {
      chatId: chat._id,
    };
    const skip = (page - 1) * limit;
    const totalChats = await this.messageModel.countDocuments(options);
    const totalPages = Math.ceil(totalChats / limit);
    const messages = await this.messageModel
      .find(options)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    return { messages, totalPage: totalPages };
  }

  update(id: string, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }
}
