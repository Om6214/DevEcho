import { Body, Controller, Get, Param, Patch, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserapiService } from './userapi.service';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { RequestWithUser } from '../posts/types/user.interface';
import { UpdateUserDto } from '../auth/dtos/updateUser.dto'
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('user')
export class UserapiController {
    constructor(
        private readonly userapiService: UserapiService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getProfile(@Param('id') id: string): Promise<any> {
        return this.userapiService.fetchProfile(id);
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

        return this.userapiService.updateProfile(userId, updateUserDto);
    }
}
