import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Todo, User } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  /**
   * this function is used to get all the todos's list
   * @returns promise of array of todos
   */
  async getAllTodos(): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      include: {
        User: true, // Include the user relation
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param userId is type of string, which represent the id of user.
   * @returns promise of user with the id passed in parameter
   */
  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param userId is type of number, which represent the id of user.
   * @returns promise of user with the todo that he has and ordered by date and priority
   */
  async getRemainingTodosForUser(userId: number): Promise<Todo[]> {
    try {
      const todos = await this.prisma.todo.findMany({
        where: {
          userId: Number(userId),
        },
        orderBy: [
          {
            date: 'desc',
          },
          {
            priority: 'desc',
          },
        ],
        include: {
          User: true,
        },
      });

      return todos;
    } catch (error) {
      // Handle errors here (e.g., log the error)
      console.error('Error fetching remaining todos:', error);
      return []; // Return an empty array or handle the error appropriately
    }
  }

  /**
   * this is function is used to create Todo in Todo service.
   * @param data this will type of data in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of todo
   */
  async createTodo(data: Todo): Promise<Todo> {
    // Retrieve user information
    const user = await this.getUserById(data.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Create a new todo with the user information
    return this.prisma.todo.create({
      data: {
        description: data.description,
        priority: data.priority,
        userId: data.userId, // Associate the todo with the user
        date: data.date,
        completed: data.completed,
      },
    });
  }

  /**
   * this function is used to updated specific todo whose id is passed in
   * body along with passed updated data
   * @param id is type of number, which represent the id of todo.
   * @param data this is partial type of data of the todo to be edited.
   * @returns promise of udpate todo
   */
  async updateTodo(
    id: number,
    data: Todo,
  ): Promise<Todo | { message: string }> {
    return this.prisma.todo.update({
      where: { id: Number(id) },
      data: {
        description: data.description,
        priority: data.priority,
        date: data.date,
        completed: data.completed,
      },
    });
  }

  /**
   * this function is used to remove or delete todo from database.
   * @param id is the type of number, which represent id of todo
   * @returns message of the todo deleted from database
   */
  async deleteTodo(id: number): Promise<Todo | { message: string }> {
    // Check if the todo with the specified id exists
    const existingTodo = await this.prisma.todo.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTodo) {
      return { message: 'Todo not found.' };
    }

    // Todo found, proceed with deletion
    return this.prisma.todo.delete({
      where: { id: Number(id) },
    });
  }
}
