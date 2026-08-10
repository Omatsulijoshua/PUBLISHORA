import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('oauth/providers')
  getOAuthProviders() {
    return {
      providers: [
        { name: 'Google', enabled: true, endpoint: '/api/v1/auth/oauth/google' },
        { name: 'Apple', enabled: true, endpoint: '/api/v1/auth/oauth/apple' },
        { name: 'Microsoft', enabled: true, endpoint: '/api/v1/auth/oauth/microsoft' },
      ],
    };
  }
}
