import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role?: UserRole;
}
