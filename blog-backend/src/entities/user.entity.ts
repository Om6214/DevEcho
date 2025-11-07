import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { Follow } from "./follow.entity";
import { Comment } from "./comment.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    name: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ default: false })
    is_verified: boolean

    @Column({ type: "varchar", length: 6, nullable: true })
    otp_code?: string | null;

    @Column({ type: 'timestamp', nullable: true })
    otp_expiration?: Date | null;

    @Column({ nullable: true })
    profile_image?: string; // 

    @Column({ nullable: true })
    cover_image?: string;

    @Column({ nullable: true })
    personal_link?: string; // 

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    // Relations
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Follow, (follow) => follow.follower)
    following: Follow[];

    @OneToMany(() => Follow, (follow) => follow.following)
    followers: Follow[];

    @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
    comments: Comment[];
}
