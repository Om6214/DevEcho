import { IsOptional, IsString } from "class-validator";

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    content: string

    @IsOptional()
    @IsString()
    image_url: string
}