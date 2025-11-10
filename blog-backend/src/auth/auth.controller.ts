import { Body, Controller, Get, Headers, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/createUser.dto'
import { LoginDto } from './dtos/login.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { RequestWithUser } from 'src/posts/types/user.interface';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { VerifyOtpDto } from './dtos/verifyOtp.dto';
import { ResendOtpDto } from './dtos/resendOtpDto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @Post('signup')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    }

    @Post('resend-otp')
    async resendOtp(@Body() resendOtpDto:ResendOtpDto ) {
        return this.authService.resendOtp(resendOtpDto.email)
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
