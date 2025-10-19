import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from 'src/entities/like.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Likes)
        private readonly likeRepo: Repository<Likes>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
    ) { }

    async likePost(userId: string, postId: string): Promise<string> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        const post = await this.postRepo.findOne({ where: { id: postId } });

        if (!user || !post) throw new NotFoundException('User or Post not found');

        const existingLike = await this.likeRepo.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (existingLike) throw new BadRequestException('You have already liked this post');

        const like = this.likeRepo.create({ user, post });
        await this.likeRepo.save(like);
        return 'You liked this post';
    }

    async unlikePost(userId: string, postId: string): Promise<string> {
        const like = await this.likeRepo.findOne({
            where: { user: { id: userId }, post: { id: postId } },
            relations: ['user', 'post'],
        });

        if (!like) throw new NotFoundException('You have not liked this post yet');

        await this.likeRepo.remove(like);
        return 'You have unliked this post';
    }

    async getPostLikes(postId: string): Promise<User[]> {
        const likes = await this.likeRepo.find({
            where: { post: { id: postId } },
            relations: ['user'],
        });
        return likes.map((l) => l.user);
    }
}
