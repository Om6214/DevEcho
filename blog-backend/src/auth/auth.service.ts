import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { CreateUserDto } from './dtos/createUser.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { MailService } from '../mail/mail.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const { username, email, password, confirmPassword } = createUserDto;
    const normalizedEmail = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      throw new BadRequestException("Password is didn't matched");
    }

    const existingUser = await this.userRepo.findOne({
      where: [{ username }, { email: normalizedEmail }],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const otp = randomInt(100000, 999999).toString();
    const expiration = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = this.userRepo.create({
      username,
      email: normalizedEmail,
      password: hashedPass,
      otp_code: otp,
      otp_expiration: expiration,
      is_verified: false,
    });

    await this.userRepo.save(newUser);
    await this.mailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent to your email. Please verify to continue.' };
  }

  async resendOtp(email: string) {

    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepo.findOne({
      where: { email: normalizedEmail }
    })
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.is_verified) {
      throw new BadRequestException('User already verified');
    }
    const otp = randomInt(100000, 999999).toString();
    const expiration = new Date(Date.now() + 5 * 60 * 1000);

    user.otp_code = otp;
    user.otp_expiration = expiration;

    await this.userRepo.save(user);
    await this.mailService.sendOtpEmail(user.email, otp);

    return {
      message: 'New OTP has been sent to your email.',
    }
  }

  async verifyOtp(email: string, otp: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email: normalizedEmail } });

    if (!user) throw new BadRequestException('User not found');
    if (user.is_verified) throw new BadRequestException('User already verified');
    if (user.otp_code !== otp) throw new UnauthorizedException('Invalid OTP');
    if (!user.otp_expiration || user.otp_expiration < new Date())
      throw new UnauthorizedException('OTP expired');

    user.is_verified = true;
    user.otp_code = null;
    user.otp_expiration = null;
    await this.userRepo.save(user);

    return { message: 'Email verified successfully!' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) throw new BadRequestException('User is not registered! Please register first');
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token, user };
  }

 

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
