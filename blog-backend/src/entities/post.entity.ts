import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Comment } from './comment.entity'

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'text', nullable: true })
    excerpt: string;

    @Column({ type: 'text', nullable: true })
    tags: string;

    @Column({ nullable: true })
    image_url?: string;

    @Column({ type: 'boolean', default: false })
    published: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.posts, {
        onDelete: 'CASCADE',
    })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}