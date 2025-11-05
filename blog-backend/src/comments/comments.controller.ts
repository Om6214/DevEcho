import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post(':postId')
    async addComment(
        @Param('postId') postId: string,
        @Body('comment') comment: string,
        @Req() req,
    ) {
        const userId = req.user.id;
        return this.commentService.createComment(userId, postId, comment);
    }

    @Get('post/:postId')
    async getComments(@Param('postId') postId: string) {
        return this.commentService.getPostComments(postId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user/:userId')
    async myComments(@Param('userId') userId: string) {
        return this.commentService.getMyComments(userId);
    }
}
