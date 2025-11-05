import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity({name: 'comments'})
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text' })
    comment: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.comments, {
        onDelete: "CASCADE",
    })
    user: User

    @ManyToOne(() => Post, (post) => post.comments, {
        onDelete: 'CASCADE',
    })
    post: Post;
}