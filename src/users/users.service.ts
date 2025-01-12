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

  async me(sub: string) {
    const user = await this.userModel.findOne({ _id: sub });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findOne(sub: string) {
    const user = await this.userModel.findOne({ _id: sub });
    return user;
  }

  async findOneWeb3(address: string) {
    const user = await this.userModel.findOne({ web3address: address });
    return user;
  }

  async update(sub: string, updateUserDto: UpdateUserDto) {
    const user = await this.me(sub);
    Object.assign(user, updateUserDto);
    await user.save();
    return user;
  }
}
