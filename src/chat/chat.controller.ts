import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QueryDto } from './dto/query.dto';
import { UpdateMessageDto } from './dto/update-chat.dto';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Request() req: any, @Body() createChatDto: CreateChatDto) {
    const { sub } = req.user;
    return this.chatService.create(sub, createChatDto);
  }

  @Get('me')
  findMe(@Request() req: any, @Query() query: QueryDto) {
    const { sub } = req.user;
    return this.chatService.findMe(sub, query);
  }

  @Get(':id')
  findAllOneChat(@Request() req: any, @Param('id') id: string) {
    const { sub } = req.user;
    return this.chatService.findOne(id, sub);
  }

  @Get(':id/messages')
  findOne(
    @Request() req: any,
    @Param('id') id: string,
    @Query() query: QueryDto,
  ) {
    const { sub } = req.user;
    return this.chatService.findAllOneChat(id, sub, query);
  }

  @Patch(':id/message')
  updateMessage(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateChatDto: UpdateMessageDto,
  ) {
    const { sub } = req.user;
    return this.chatService.updateMessage(id, sub, updateChatDto);
  }

  @Delete(':id/message')
  deleteMessage(@Request() req: any, @Param('id') id: string) {
    const { sub } = req.user;
    return this.chatService.deleteMessage(id, sub);
  }
}
