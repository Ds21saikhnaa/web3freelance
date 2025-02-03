import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto, CreateMessageDto } from './dto/create-chat.dto';
import { UpdateMessageDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, Message } from './entities/chat.entity';
import { ClientSession, Model } from 'mongoose';
import { QueryDto } from './dto/query.dto';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatService {
  constructor(
    private authService: AuthService,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}
  async create(sub: string, createChatDto: CreateChatDto) {
    const { toUser, job } = createChatDto;
    if (toUser === sub) {
      throw new BadRequestException('Something went wrong');
    }
    const newChat = new this.chatModel({
      job,
      participants: [sub, toUser],
    });
    await newChat.save();
    return newChat;
  }

  async createRoom(
    client: string,
    lancer: string,
    job: string,
    session: ClientSession,
  ) {
    const newChat = new this.chatModel({
      job: job,
      participants: [client, lancer],
    });
    await newChat.save({ session });
    return newChat;
  }

  async deleteRoom(id: string) {
    return await this.chatModel.findOneAndDelete({ job: id });
  }

  async createMessage(sub: string, dto: CreateMessageDto) {
    const { chatId, message } = dto;
    const newMessage = new this.messageModel({
      sender: sub,
      chatId,
      message,
    });
    await newMessage.save();
    return;
  }

  async findMe(sub: string, query: QueryDto) {
    const { page = 1, sort = '-createdAt', limit = 1000 } = query;
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
      .populate({
        path: 'participants',
        select: 'userName profile web3address',
      })
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
    const { page = 1, sort = 'createdAt', limit = 1000 } = query;
    const chat = await this.findOne(id, sub);
    const options: Record<string, any> = {
      chatId: chat._id,
    };
    const skip = (page - 1) * limit;
    const totalChats = await this.messageModel.countDocuments(options);
    const totalPages = Math.ceil(totalChats / limit);
    const messages = await this.messageModel
      .find(options)
      .populate({ path: 'sender', select: 'web3address userName profile' })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    return { messages, totalPage: totalPages };
  }

  async updateMessage(
    id: string,
    sub: string,
    updateChatDto: UpdateMessageDto,
  ) {
    const message = await this.messageModel.findOneAndUpdate(
      {
        _id: id,
        sender: sub,
      },
      { message: updateChatDto.message },
      { new: true },
    );
    if (!message) {
      throw new NotFoundException(`Chat not found`);
    }
    return message;
  }

  async deleteMessage(id: string, sub: string) {
    const message = await this.messageModel.findOneAndDelete({
      _id: id,
      sender: sub,
    });
    if (!message) {
      throw new NotFoundException(
        `Message not found or you are not authorized to delete it.`,
      );
    }
    return message;
  }

  async canActivate(client: Socket, chatId: string) {
    const bearerToken = client.handshake.auth.Authorization.split(' ')[1];
    const { sub }: { sub: string } =
      this.authService.decodePayload(bearerToken);
    const chat = await this.chatModel.findOne(
      {
        _id: chatId,
        participants: sub,
      },
      '_id',
    );
    return !!chat ? sub : false;
  }
}
