import { Request, Response } from 'express';
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);

      return res
        .status(200)
        .json({ message: 'User logged in successfully', result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  @Post('register')
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() registerDto: RegisterUserDto,
  ): Promise<any> {
    try {
      // Check if the new email is already in use by another user
      const existingUserWithSameEmail = await this.userService.getUserByEmail(
        registerDto.email, // Use registerDto.email instead of postData.email
      );

      if (existingUserWithSameEmail) {
        // Handle the case where the email is already in use
        return res
          .status(400)
          .json({ message: 'Email is already in use by another user.' });
      }

      const result = await this.authService.register(registerDto);

      return res
        .status(200)
        .json({ message: 'User registered successfully', result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }
}
