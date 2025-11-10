// posts/posts.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { RequestWithUser } from './types/user.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postService: PostsService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: CreatePostDto,
        @Req() req: RequestWithUser
    ) {
        const userId = req.user['userId'];
        let imageUrl = '';
        if (image) {
            try {
                const uploadResult = await this.cloudinaryService.uploadImage(image);
                imageUrl = uploadResult.secure_url;
            } catch (error) {
                throw new BadRequestException('Image upload failed', error);
            }
        }
        const published = body.published === true;

        const createPostDto: CreatePostDto = {
            title: body.title,
            content: body.content,
            excerpt: body.excerpt,
            tags: body.tags,
            published,
            image_url: imageUrl,
        };
        return this.postService.createPost(userId, createPostDto);
    }

    @Get()
    findAll(@Query('published') published?: string) {
        if (published === 'true') {
            return this.postService.getPublishedPost();
        }
        return this.postService.getAllPost();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postService.getPostById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/posts')
    findUserPost(@Req() req: RequestWithUser) {
        const userId = req.user['userId'];
        return this.postService.getUserPost(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Req() req: RequestWithUser) {
        const userId = req.user['userId'];
        return this.postService.updateUserPost(id, userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string, @Req() req: RequestWithUser) {
        const userId = req.user['userId'];
        return this.postService.deletePost(userId, id);
    }
}