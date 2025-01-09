import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('oidc')
  @UseGuards(AuthGuard('oidc'))
  async oidcLogin(@Req() req: any) {
    // The guard will redirect to OIDC provider
  }

  @Get('oidc/callback')
  async oidcCallback(@Req() req: any) {
    const { code, state } = req.query;

    return await this.authService.loginWithOIDC(code);
  }
}
