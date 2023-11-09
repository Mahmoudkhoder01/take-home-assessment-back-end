import { PrismaService } from 'src/prisma.service';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get all users
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Get user by id
  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }

  // Create a new user
  async createUser(data: User): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  // Update user by id
  async updateUser(
    id: number,
    data: User,
  ): Promise<User | { message: string }> {
    // Check if the new email is already in use by another user
    const existingUserWithSameEmail = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: Number(id) },
      },
    });

    if (existingUserWithSameEmail) {
      return { message: 'Email is already in use by another user.' };
    }

    // Update the user if the email is not in use
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: { name: data.name, email: data.email, password: data.password },
    });
  }

  // Delte user by id
  async deleteUser(id: number): Promise<User | { message: string }> {
    // Check if the user with the specified id exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return { message: 'User not found.' };
    }

    // User found, proceed with deletion
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}
