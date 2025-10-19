import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    image_url?: string;
}