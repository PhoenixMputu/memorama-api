import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';

import { encrypt, compare } from 'src/utils/bcrypt';
// import { generateCode } from 'src/utils/speakeasy';

import { SignupDto } from './dto/signup.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly JwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, name, firstname } = signupDto;

    const existsUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existsUser) throw new ConflictException('User already exists');

    const hashedPassword = await encrypt(password);
    const user = await this.prismaService.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        password: hashedPassword,
        firstname: firstname.charAt(0).toUpperCase() + firstname.slice(1),
      },
    });

    const payload = {
      sub: user.userId,
      email: user.email,
    };
    const token = this.JwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_SECRET'),
    });

    const url = `http://localhost:3000/auth/${user.userId}/${token}`;

    await this.mailService.sendSignupConfirmation(user.email, url);

    return {
      token,
      message: 'Mail has been sent successfully!',
      data: {
        id: user.userId,
        name: user.name,
        firstname: user.firstname,
        email: user.email,
      },
    };
  }

  async confirmEmail(userId: any) {
    if (userId.length < 1 || userId === 0) throw new Error("Bad request");

    const existsUser = await this.prismaService.user.findUnique({
      where: { userId: parseInt(userId) },
    });

    const user = await this.prismaService.user.update({
      where: { userId: parseInt(userId) },
      data: { state: 'active' } as Prisma.UserUpdateInput,
    });

    return {
      message: 'Email Confirmed !',
      data: {
        user,
      },
    };
    
  }
}
