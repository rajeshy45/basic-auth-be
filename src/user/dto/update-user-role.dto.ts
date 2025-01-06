import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  username: string;

  @IsEnum(UserRole)
  role: UserRole;
}
