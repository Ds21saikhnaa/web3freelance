import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from './ws.guard';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3001',
      'https://apelance.com',
      'http://localhost:3000',
    ],
    credentials: true,
  },
})
@UseGuards(WsGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, { chatId, message }: any) {
    try {
      const sub = await this.chatService.canActivate(client, chatId);
      if (sub) {
        await this.chatService.createMessage(sub, { chatId, message });
        this.server
          .to(chatId)
          .emit('receiveMessage', { chatId, message, sender: sub });
      } else throw new WsException('Forbidden');
    } catch {
      throw new WsException('Forbidden');
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, { chatId }: any) {
    try {
      const sub = await this.chatService.canActivate(client, chatId);
      if (sub) {
        client.join(chatId);
      } else throw new WsException('Forbidden');
    } catch {
      throw new WsException('Forbidden');
    }
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(client: Socket, { chatId }: any) {
    try {
      const sub = await this.chatService.canActivate(client, chatId);
      if (sub) {
        client.leave(chatId);
      } else throw new WsException('Forbidden');
    } catch {
      throw new WsException('Forbidden');
    }
  }
}
