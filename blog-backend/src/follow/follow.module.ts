import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Follow } from 'src/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  providers: [FollowService],
  controllers: [FollowController],
  exports: [FollowService]
})
export class FollowModule { }
