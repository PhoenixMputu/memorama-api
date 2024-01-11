import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('confirmEmail')
  confirmEmail(@Query('userId') userId: any) {
    return this.authService.confirmEmail(userId);
  }
}
