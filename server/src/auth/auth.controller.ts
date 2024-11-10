import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login/store')
  async signInByStore(@Body() signInDto: SignInDto) {
    try {
      const { email, password } = signInDto;
      return await this.authService.signInByCustomer(email, password);
    } catch (error) {
      console.log(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/dashboard')
  async signInByDashboard(@Body() signInDto: SignInDto) {
    try {
      const { email, password } = signInDto;
      return await this.authService.signInByStaff(email, password);
    } catch (error) {
      console.log(error);
    }
  }
}
