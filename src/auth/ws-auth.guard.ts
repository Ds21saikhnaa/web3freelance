import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);
      client.request.user = payload;
      return client.request;
    } catch (err) {
      console.log(err);
      throw new Error('Invalid token: ');
    }
  }
}
