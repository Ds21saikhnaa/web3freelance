import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ValidWeb3Address } from 'src/utils';
import { ethers } from 'ethers';

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

  async getNonce(address: string) {
    let user = await this.userService.findOneWeb3(address);
    if (!user) {
      user = await this.userService.login(address);
    }
    const nonce = `Sign this message to authenticate: ${Math.floor(
      Math.random() * 1000000,
    )}`;
    user.nonce = nonce;
    await user.save();
    return { nonce };
  }

  async verifySignature(web3Address: string, signature: string) {
    const user = await this.userService.findOneWeb3(web3Address);
    if (!user || !user.nonce) {
      throw new ForbiddenException('User or nonce not found');
    }

    const { nonce } = user;

    const recoveredAddress = ethers.verifyMessage(nonce, signature);

    if (recoveredAddress.toLowerCase() !== web3Address.toLowerCase()) {
      throw new ForbiddenException('Invalid signature');
    }

    user.nonce = null;
    await user.save();
    const accessToken = await this.generateJwtToken(user);
    return {
      web3Address,
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
