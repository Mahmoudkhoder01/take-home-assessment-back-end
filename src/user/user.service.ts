import { PrismaService } from '../prisma.service';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get all users
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        Todo: true, // Include the todos relation
      },
    });
  }

  // Get user by id and include their todos with specific sorting
  async getUserById(id: number): Promise<User | null> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight (00:00:00.000)

    return this.prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        Todo: {
          where: {
            date: {
              gte: currentDate, // Filter for date greater than or equal to today
            },
          },
          orderBy: [
            { date: 'desc' }, // Sort by creation date (new to old)
            { priority: 'desc' }, // Then, sort by priority (desc)
          ],
        },
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  // Create a new user
  async createUser(data: User): Promise<User> {
    // If the email is not taken, proceed with user creation
    const newUser = await this.prisma.user.create({
      data,
    });

    return newUser;
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
    // Find and delete associated todos
    const todosToDelete = await this.prisma.todo.findMany({
      where: { userId: Number(id) },
    });

    for (const todo of todosToDelete) {
      await this.prisma.todo.delete({ where: { id: todo.id } });
    }

    // Proceed with deleting the user
    return this.prisma.user.delete({ where: { id: Number(id) } });
  }
}
