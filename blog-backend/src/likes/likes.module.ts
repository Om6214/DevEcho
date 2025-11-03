import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Likes } from '../entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post, Likes])],
    providers: [LikesService],
    controllers: [LikesController]
})
export class LikesModule { }
