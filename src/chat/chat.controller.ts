import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, CreateMessageDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QueryDto } from './dto/query.dto';

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

  @Post('message')
  createMessage(@Request() req: any, @Body() dto: CreateMessageDto) {
    const { sub } = req.user;
    return this.chatService.createMessage(sub, dto);
  }

  @Get('me')
  findMe(@Request() req: any, @Query() query: QueryDto) {
    const { sub } = req.user;
    return this.chatService.findMe(sub, query);
  }

  @Get(':id')
  findAllOneChat(@Request() req: any, @Param('id') id: string) {
    console.log('ene');
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(id, updateChatDto);
  }
}
