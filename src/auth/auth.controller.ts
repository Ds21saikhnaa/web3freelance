import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginInput, SignatureInput } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @Post('login')
  // login(@Body() loginDto: LoginInput) {
  //   return this.authService.login(loginDto);
  // }

  @Post('getNonce')
  async getNonce(@Body() body: LoginInput) {
    return this.authService.getNonce(body.web3address);
  }

  @Post('verifySignature')
  async verifySignature(@Body() body: SignatureInput) {
    const { web3address, signature } = body;
    return this.authService.verifySignature(web3address, signature);
  }
}
