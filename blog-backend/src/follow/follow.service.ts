import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from 'src/entities/follow.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Follow)
        private readonly followRepo: Repository<Follow>,
    ) { }

    async followUser(followerId: string, followingId: string): Promise<string> {
        if (followerId === followingId) {
            throw new BadRequestException('You cannot follow yourself!');
        }

        const [follower, following] = await Promise.all([
            this.userRepo.findOne({ where: { id: followerId } }),
            this.userRepo.findOne({ where: { id: followingId } }),
        ]);

        if (!follower || !following) {
            throw new NotFoundException('User not found');
        }

        const existingFollow = await this.followRepo.findOne({
            where: { follower: { id: followerId }, following: { id: followingId } },
        });

        if (existingFollow) {
            throw new BadRequestException(`You are already following ${following.username}`);
        }

        const follow = this.followRepo.create({ follower, following });
        await this.followRepo.save(follow);

        return `You are now following ${following.username}`;
    }

    async unfollowUser(followerId: string, followingId: string): Promise<string> {
        const follow = await this.followRepo.findOne({
            where: { follower: { id: followerId }, following: { id: followingId } },
            relations: ['follower', 'following'],
        });

        if (!follow) {
            throw new NotFoundException('You are not following this user');
        }

        await this.followRepo.remove(follow);
        return `You have unfollowed ${follow.following.username}`;
    }

    async getUserFollowers(userId: string): Promise<User[]> {
        const followers = await this.followRepo.find({
            where: { following: { id: userId } },
            relations: ['follower', 'following'],
        });

        return followers.map(f => f.follower);
    }

    async getUserFollowing(userId: string): Promise<User[]> {
        const following = await this.followRepo.find({
            where: { follower: { id: userId } },
            relations: ['follower', 'following'],
        });

        return following.map(f => f.following);
    }

    async getOtherUserFollowers(requesterId: string, targetUserId: string): Promise<User[]> {
        const mutual = await this.areMutualFollowers(requesterId, targetUserId);
        if (!mutual) {
            throw new ForbiddenException('You can only see followers if both are following each other');
        }

        const followers = await this.followRepo.find({
            where: { following: { id: targetUserId } },
            relations: ['follower', 'following'],
        });

        return followers.map(f => f.follower);
    }

    async getOtherUserFollowing(requesterId: string, targetUserId: string): Promise<User[]> {
        const mutual = await this.areMutualFollowers(requesterId, targetUserId);
        if (!mutual) {
            throw new ForbiddenException('You can only see following if both are following each other');
        }

        const following = await this.followRepo.find({
            where: { follower: { id: targetUserId } },
            relations: ['follower', 'following'],
        });

        return following.map(f => f.following);
    }

    async areMutualFollowers(userId1: string, userId2: string): Promise<boolean> {
        const follow1 = await this.followRepo.findOne({
            where: { follower: { id: userId1 }, following: { id: userId2 } },
        });
        const follow2 = await this.followRepo.findOne({
            where: { follower: { id: userId2 }, following: { id: userId1 } },
        });

        return !!(follow1 && follow2);
    }
}
