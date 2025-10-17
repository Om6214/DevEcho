import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ nullable: true })
    image_url?: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @ManyToOne(() => User, (user) => user.posts, {
        onDelete: 'CASCADE',
    })
    user: User;
}