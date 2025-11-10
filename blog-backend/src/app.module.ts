import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Follow } from './entities/follow.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { FollowModule } from './follow/follow.module';
import { LikesModule } from './likes/likes.module';
import { Likes } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { UserapiModule } from './userapi/userapi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'blog',
      entities: [User, Post, Likes, Follow, Comment],
      synchronize: true
    }),
    AuthModule,
    PostsModule,
    FollowModule,
    LikesModule,
    CommentsModule,
    UserapiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
