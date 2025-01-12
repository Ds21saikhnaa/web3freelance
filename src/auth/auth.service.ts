import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { isAddress } from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginInput) {
    const { web3address } = loginDto;
    const validAddress = isAddress(web3address);
    if (!validAddress) {
      throw new BadRequestException('This address is not a web3 address.');
    }
    const existUser = await this.userService.findOne(web3address);
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
