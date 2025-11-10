import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Follow } from '../entities/follow.entity';
import { UpdateUserDto } from '../auth/dtos/updateUser.dto';

@Injectable()
export class UserapiService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Follow)
        private readonly followRepo: Repository<Follow>,
    ) { }

    async fetchProfile(userId: string) {
        // Fetch the user
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: ['id', 'username','name', 'email', 'profile_image', 'bio', 'cover_image', 'personal_link'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Fetch followers (people who follow this user)
        const followers = await this.followRepo.find({
            where: { following: { id: userId } },
            relations: ['follower'],
        });

        // Fetch following (people this user follows)
        const following = await this.followRepo.find({
            where: { follower: { id: userId } },
            relations: ['following'],
        });

        // Format response
        return {
            ...user,
            followersCount: followers.length,
            followingCount: following.length,
            followers: followers.map((f) => ({
                id: f.follower.id,
                username: f.follower.username,
                profilePic: f.follower.profile_image,
            })),
            following: following.map((f) => ({
                id: f.following.id,
                username: f.following.username,
                profilePic: f.following.profile_image,
            })),
        };
    }

    async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('User not found');

        Object.assign(user, updateUserDto);
        return this.userRepo.save(user);
    }
}
