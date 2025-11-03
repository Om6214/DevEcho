import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async createPost(userId: string, createPostDto: CreatePostDto): Promise<Post> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        })

        if (!user) {
            throw new BadRequestException('User not found!');
        }

        const post = this.postRepo.create({ ...createPostDto, user });
        return this.postRepo.save(post);
    }

    async getAllPost(): Promise<Post[]> {
        return this.postRepo.find({
            relations: ['user']
        })
    }

    async getUserPost(userId: string): Promise<Post[]> {
        return this.postRepo.find({
            where: { user: { id: userId } },
            relations: ['user'],
            order: { created_at: 'DESC' }

        });
    }

    async updateUserPost(postId: string, userId: string, updatePostDto: UpdatePostDto): Promise<Post> {
        const post = await this.postRepo.findOne({
            where: { id: postId },
            relations: ['user'],
        })

        if (!post) {
            throw new NotFoundException('Sorry Post not found!');
        }

        if (post.user.id !== userId) {
            throw new UnauthorizedException('You can only edit your post not others');
        }

        Object.assign(post, updatePostDto);
        return this.postRepo.save(post);
    }

    async deletePost(userId: string, postId: string): Promise<void> {
        const post = await this.postRepo.findOne({
            where: { id: postId },
            relations: ['user'],
        });

        if (!post) {
            throw new NotFoundException('Sorry, post not found');
        }

        if (post.user.id !== userId) {
            throw new UnauthorizedException('You can only delete your own post');
        }

        await this.postRepo.remove(post);
    }

}
