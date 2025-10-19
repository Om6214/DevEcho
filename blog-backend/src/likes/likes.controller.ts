import { Controller, Post, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { type RequestWithUser } from 'src/posts/types/user.interface';

@Controller('likes')
export class LikesController {
    constructor(private readonly likesService: LikesService) { }


    @UseGuards(JwtAuthGuard)
    @Post(':postId')
    likePost(@Param('postId') postId: string, @Req() req: RequestWithUser) {
        const userId = req.user.userId;
        return this.likesService.likePost(userId, postId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':postId')
    unlikePost(@Param('postId') postId: string, @Req() req: RequestWithUser) {
        const userId = req.user.userId;
        return this.likesService.unlikePost(userId, postId);
    }

    @Get('post/:postId')
    getPostLikes(@Param('postId') postId: string) {
        return this.likesService.getPostLikes(postId);
    }
}
