import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;
    @IsStrongPassword()
    @IsString()
    password: string;
}