import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ValidWeb3Address } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginInput) {
    const { web3address } = loginDto;
    ValidWeb3Address(web3address);
    const existUser = await this.userService.findOneWeb3(web3address);
    let user: User | null;
    if (existUser) {
      user = existUser;
    } else {
      user = await this.userService.login(web3address);
    }
    const accessToken = await this.generateJwtToken(user);
    return {
      access_token: accessToken,
    };
  }

  async generateJwtToken(user: User) {
    const payload = {
      sub: user._id,
      web3address: user.web3address,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
