import { IsNotEmpty } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    first_name: string;

    last_name?: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}