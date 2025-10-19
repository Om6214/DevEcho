import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Likes } from 'src/entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post, Likes])],
    providers: [LikesService],
    controllers: [LikesController]
})
export class LikesModule { }
