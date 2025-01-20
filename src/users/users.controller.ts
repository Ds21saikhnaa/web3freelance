import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QueryDto } from './dto/query.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
