import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  Query,
  Param,
  Post,
  Delete,
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

  @ApiBearerAuth()
  @Post('saveJob/:jobId')
  @UseGuards(AuthGuard('jwt'))
  saveJob(@Request() req: any, @Param('jobId') id: string) {
    const { sub } = req.user;
    return this.usersService.saveJob(sub, id);
  }

  @ApiBearerAuth()
  @Delete('removeJob/:jobId')
  @UseGuards(AuthGuard('jwt'))
  removeJob(@Request() req: any, @Param('jobId') id: string) {
    const { sub } = req.user;
    return this.usersService.removeJob(sub, id);
  }
}
