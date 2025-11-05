import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Comment } from './comment.entity'

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

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}