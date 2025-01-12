import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Request() req: any) {
    const { sub } = req.user;
    return this.usersService.me(sub);
  }

  @ApiBearerAuth()
  @Patch('')
  @UseGuards(AuthGuard('jwt'))
  update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    const { sub } = req.user;
    return this.usersService.update(sub, updateUserDto);
  }
}
