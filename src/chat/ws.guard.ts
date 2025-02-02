import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.auth.Authorization.split(' ')[1];
    try {
      const decoded = this.auth.verifyToken(bearerToken);
      return new Promise((resolve, reject) => {
        if (decoded) {
          resolve(decoded);
        } else {
          reject(false);
        }
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
