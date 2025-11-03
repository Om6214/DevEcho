import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { type RequestWithUser } from './types/user.interface';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreatePostDto, @Req() req: RequestWithUser) {
        const userId = req.user['userId'];
        return this.postService.createPost(userId, dto);
    }

    @Get('all')
    findAll() {
        return this.postService.getAllPost();
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
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
