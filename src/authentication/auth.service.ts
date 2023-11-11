import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismyService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.prismyService.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    // Generate a JWT token and return it as a response
    const token = this.jwtService.sign({ email });

    return { token: token, userInfo: user };
  }

  async register(createDto: RegisterUserDto): Promise<any> {
    // Check if the new email is already in use by another user
    const existingUserWithSameEmail = await this.userService.getUserByEmail(
      createDto.email,
    );

    if (existingUserWithSameEmail) {
      return { message: 'Email is already in use by another user.' };
    }

    // If the email is not taken, proceed with user creation
    const createUser = new User();
    createUser.name = createDto.name;
    createUser.email = createDto.email;
    createUser.password = await bcrypt.hash(createDto.password, 10);

    const user = await this.userService.createUser(createUser);
    const token = await this.jwtService.sign({ email: user.email });

    return { token: token, userInfo: user };
  }
}
