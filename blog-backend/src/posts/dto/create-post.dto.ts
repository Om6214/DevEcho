import { Transform } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    excerpt?: string;

    @IsString()
    @IsOptional()
    tags?: string;

    @IsString()
    @IsOptional()
    image_url?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === "true" || value === true)
    published?: boolean;
}