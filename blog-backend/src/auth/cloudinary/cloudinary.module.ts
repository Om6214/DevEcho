import { Module } from '@nestjs/common';
import { CloudinaryProvider } from '../../cloudinary/cloudinary.config';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
