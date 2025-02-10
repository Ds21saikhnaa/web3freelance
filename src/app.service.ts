import { Injectable } from '@nestjs/common';
import { ImageService } from './image/image.service';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly imageService: ImageService,
    private readonly userService: UsersService,
  ) {}
  getHello() {
    return 'Working!';
  }
}
