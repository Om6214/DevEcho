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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: true,
      },
      entities: [User, Post, Likes, Follow]
    }),
    AuthModule,
    PostsModule,
    FollowModule,
    LikesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
