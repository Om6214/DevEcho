import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity'
import { Post } from "../entities/post.entity"

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
        
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
    ) { }

    async createComment(userId: string, postId: string, commentText: string): Promise<Comment> {
        const user = await this.userRepo.findOne({
            where: {
                id: userId,
            }
        })
        if (!user) {
            throw new BadRequestException('User not fount');
        }
        const post = await this.postRepo.findOne({
            where: {
                id: postId,
            }
        })
        if (!post) {
            throw new BadRequestException('Post not fount');
        }

        const newComment = this.commentRepo.create({
            comment: commentText,
            user,
            post
        })
        const savedComment = await this.commentRepo.save(newComment);
        return savedComment;
    }

    async getPostComments(postId: string): Promise<Comment[]> {
        const post = await this.postRepo.findOne({
            where: {
                id: postId,
            }
        })
        if (!post) {
            throw new BadRequestException('Post not available');
        }

        return this.commentRepo.find({
            where: {
                post: {
                    id: postId,
                }
            },
            relations: ['user'],
            order: { created_at: 'DESC' }
        })
    }

    async getMyComments(userId: string): Promise<Comment[]> {
        const comment = await this.commentRepo.find({
            where: {
                user: { id: userId },
            },
            relations: ['user'],
            order: { created_at: 'DESC' }
        })

        return comment;
    }
}
