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
import axios from 'axios';
import * as querystring from 'querystring';
import { UserRole } from 'src/common/enums/user-role.enum';

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

  async loginWithOIDC(code: string) {
    try {
      const tokenResponse = await axios.post(
        process.env.OIDC_TOKEN_URL,
        querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.OIDC_CALLBACK_URL,
          client_id: process.env.OIDC_CLIENT_ID,
          client_secret: process.env.OIDC_CLIENT_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const { access_token } = tokenResponse.data;

      const payload = this.jwtService.decode(access_token);
      console.log(payload);

      let user = await this.userService.findOne(payload.sub);
      if (!user) {
        let role = payload.firewall_role;
        if (!Object.values(UserRole).includes(role)) {
          role = UserRole.READ_ONLY;
        }

        user = await this.userService.create(
          { email: payload.sub, password: null, first_name: payload.first_name },
          role,
        );
      }

      return {
        token: await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
          role: user.role,
        }),
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
