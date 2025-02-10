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
import { ReviewDto } from './dto/create-user.dto';

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
  @Post('review/:userId')
  @UseGuards(AuthGuard('jwt'))
  addReview(
    @Request() req: any,
    @Param('userId') id: string,
    @Body() dto: ReviewDto,
  ) {
    const { sub } = req.user;
    return this.usersService.addReview(id, sub, dto);
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

  @ApiBearerAuth()
  @Post('saveUser/:userId')
  @UseGuards(AuthGuard('jwt'))
  saveUser(@Request() req: any, @Param('userId') id: string) {
    const { sub } = req.user;
    return this.usersService.saveUser(sub, id);
  }

  @ApiBearerAuth()
  @Delete('removeUser/:userId')
  @UseGuards(AuthGuard('jwt'))
  removeUser(@Request() req: any, @Param('userId') id: string) {
    const { sub } = req.user;
    return this.usersService.removeUser(sub, id);
  }
}
