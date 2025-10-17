import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Follow {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
    follower: User;

    @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
    following: User;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}