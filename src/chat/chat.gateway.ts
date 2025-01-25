import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: any): void {
    const { chatId, message, sender } = payload;
    this.server.to(chatId).emit('receiveMessage', { chatId, message, sender });
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, chatId: string): void {
    client.join(chatId);
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, chatId: string): void {
    client.leave(chatId);
    console.log(`Client ${client.id} left chat ${chatId}`);
  }
}
