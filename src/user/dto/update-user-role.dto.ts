import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}
