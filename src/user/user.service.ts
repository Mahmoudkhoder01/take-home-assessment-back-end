import { PrismaService } from '../prisma.service';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        Todo: true, // Include the todos relation
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user with the todo that he has and ordered by date and priority
   */
  async getUserById(id: number): Promise<User | null> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight (00:00:00.000)
    const currentDateStr = currentDate.toISOString().split('T')[0];

    return this.prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        Todo: {
          where: {
            date: {
              gte: currentDateStr, // Filter for date greater than or equal to today
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

  /**
   * this function used to get data of use whose email is passed in parameter
   * @param email is type of string, which represent the email of user.
   * @returns promise of user with the email passed in parameter
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  /**
   * this is function is used to create User in User service.
   * @param data this will type of data in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async createUser(data: User): Promise<User> {
    // If the email is not taken, proceed with user creation
    const newUser = await this.prisma.user.create({
      data,
    });

    return newUser;
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param data this is partial type of data of the user to be edited.
   * @returns promise of udpate user
   */
  async updateUser(
    id: number,
    data: User,
  ): Promise<User | { message: string }> {
    const existingUserWithSameEmail = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: Number(id) },
      },
    });

    // Check if the new email is already in use by another user
    if (existingUserWithSameEmail) {
      return { message: 'Email is already in use by another user.' };
    }

    // Update the user if the email is not in use
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: { name: data.name, email: data.email, password: data.password },
    });
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns message of the user deleted from database
   */
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
