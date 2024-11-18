import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login/store')
  async signInByStore(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    return await this.authService.signInByCustomer(email, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/dashboard')
  async signInByDashboard(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    return await this.authService.signInByStaff(email, password);
  }
}
