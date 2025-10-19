import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { type RequestWithUser } from 'src/posts/types/user.interface';

@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async followUser(@Param('id') followingId: string, @Req() req: RequestWithUser) {
        const followerId = req.user.userId;
        return this.followService.followUser(followerId, followingId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async unfollowUser(@Param('id') followingId: string, @Req() req: RequestWithUser) {
        const followerId = req.user.userId;
        return this.followService.unfollowUser(followerId, followingId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/followers')
    async getMyFollowers(@Req() req: RequestWithUser) {
        const userId = req.user.userId;
        return this.followService.getUserFollowers(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/following')
    async getMyFollowing(@Req() req: RequestWithUser) {
        const userId = req.user.userId;
        return this.followService.getUserFollowing(userId);
    }

    // for all users to see any users followers
    @UseGuards(JwtAuthGuard)
    @Get('followers/:id')
    async getOtherUserFollowers(@Param('id') targetUserId: string, @Req() req: RequestWithUser) {
        const requesterId = req.user.userId;
        return this.followService.getOtherUserFollowers(requesterId, targetUserId);
    }

    // for all users to see any users following
    @UseGuards(JwtAuthGuard)
    @Get('following/:id')
    async getOtherUserFollowing(@Param('id') targetUserId: string, @Req() req: RequestWithUser) {
        const requesterId = req.user.userId;
        return this.followService.getOtherUserFollowing(requesterId, targetUserId);
    }
}
