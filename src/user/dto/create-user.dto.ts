import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    role?: UserRole;
}
