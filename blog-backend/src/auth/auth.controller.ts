import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/auth/dtos/createUser.dto';
import { LoginDto } from 'src/auth/dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('signin')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('verify')
    async verify(@Headers('authorization') authHeader: string) {
        const token = authHeader?.split(' ')[1];
        return await this.authService.verifyToken(token);
    }
}
