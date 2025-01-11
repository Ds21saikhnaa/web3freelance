import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async login(web3address: string) {
    const user = new this.userModel({ web3address });
    await user.save();
    return user;
  }

  async findAll() {
    const users = await this.userModel.find().lean();
    return users;
  }

  async me(address: string) {
    const user = await this.userModel.findOne({ web3address: address });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findOne(address: string) {
    const user = await this.userModel.findOne({ web3address: address });
    return user;
  }

  async update(address: string, updateUserDto: UpdateUserDto) {
    const user = await this.me(address);
    Object.assign(user, updateUserDto);
    await user.save();
    return user;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
