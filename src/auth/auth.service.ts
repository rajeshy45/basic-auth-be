import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const user = await this.userService.findOne(loginDto.email);

      if (user) {
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (isMatch) {
          return {
            token: await this.jwtService.signAsync({
              sub: user.id,
              email: user.email,
              role: user.role,
            }),
          };
        } else {
          throw new UnauthorizedException('Invalid credentials');
        }
      }

      throw new BadRequestException('User not found. Please register.');
    } catch (err) {
      console.error('Error while login: ' + err);

      if (err.response.statusCode) {
        throw err;
      }

      throw new Error('Failed to login');
    }
  }

  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    try {
      const user = await this.userService.findOne(registerDto.email);

      if (!user) {
        const user = await this.userService.create(registerDto);
        return {
          token: await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
          }),
        };
      }

      throw new BadRequestException('User already registered. Please login.');
    } catch (err) {
      console.error('Error while register: ' + err);

      if (err.response.statusCode) {
        throw err;
      }
      throw new Error('Failed to register');
    }
  }

  async loginWithOIDC(profile: any) {
    try {
      const email = profile.email;

      const user = await this.userService.findOne(email);

      if (!user) {
        throw new BadRequestException('User not found. Please register.');
      }

      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (err) {
      console.error('Error while login with OIDC: ' + err);

      if (err.response.statusCode) {
        throw err;
      }

      throw new Error('Failed to login with OIDC');
    }
  }
}
