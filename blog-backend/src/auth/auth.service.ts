import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dtos/login.dto';

@Injectable()
export class AuthService {
    @InjectRepository(User)
    private userRepo: Repository<User>
    constructor(
        private jwtService: JwtService
    ) { }
    async register(@Body() createUserDto: CreateUserDto) {
        const { username, email, password } = createUserDto;
        const existinguUser = await this.userRepo.findOne({
            where: [{ username }, { email }],
        })

        if (existinguUser) {
            throw new BadRequestException('User already exist');
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = this.userRepo.create({
            username,
            email,
            password: hashedPass
        })

        const savedUser = await this.userRepo.save(newUser);

        const payload = { id: savedUser.id, username: savedUser.username };

        const token = this.jwtService.sign(payload);
        return {
            message: 'User registered successfully',
            token,
            user: {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email
            }
        }
    }

    async login(@Body() loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepo.findOne({
            where: { email }
        })
        if (!user) {
            throw new BadRequestException('User is not registered! Please register first');
        }
        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            throw new UnauthorizedException('Invalid Creds');
        }
        const payload = { id: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        return {
            accessToken: token
        }
    }

    async verifyToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
