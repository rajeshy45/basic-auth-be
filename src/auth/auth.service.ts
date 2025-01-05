import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) { }

	async login(authDto: AuthDto): Promise<{ token: string }> {
		try {
			const user = await this.userService.findOne(authDto.username);

			if (user) {
				const isMatch = await bcrypt.compare(authDto.password, user.password);
				if (isMatch) {
					return { token: await this.jwtService.signAsync({ sub: user.id, username: user.username, role: user.role }) }
				} else {
					throw new UnauthorizedException('Invalid credentials');
				}
			}
			throw new BadRequestException('User not found');
		} catch (error) {
			console.error('Error while login: ' + error);
			throw new Error('Failed to login');
		}
	}

	async register(authDto: AuthDto): Promise<{ token: string }> {
		try {
			const user = await this.userService.findOne(authDto.username);

			if (!user) {
				const user = await this.userService.create(authDto);
				return { token: await this.jwtService.signAsync({ sub: user.id, username: user.username, role: user.role }) }
			}
			throw new BadRequestException('User already registered');
		} catch (error) {
			console.error('Error while login: ' + error);
			throw new Error('Failed to login');
		}
	}
}
