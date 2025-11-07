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


    @UseGuards(AuthGuard('jwt'))
    @Patch('update-profile')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'profile_image', maxCount: 1 },
            { name: 'cover_image', maxCount: 1 },
        ])
    )
    async updateProfile(
        @Req() req: RequestWithUser,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFiles() files: { profile_image?: Express.Multer.File[]; cover_image?: Express.Multer.File[] },

    ) {
        const userId = req.user.userId;

        if (files?.profile_image) {
            const uploadResult = await this.cloudinaryService.uploadImage(files.profile_image[0]);
            updateUserDto.profile_image = uploadResult.secure_url;
        }

        if (files?.cover_image) {
            const uploadResult = await this.cloudinaryService.uploadImage(files.cover_image[0]);
            updateUserDto.cover_image = uploadResult.secure_url;
        }

        return this.authService.updateProfile(userId, updateUserDto);
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
