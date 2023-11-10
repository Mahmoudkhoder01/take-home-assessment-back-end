import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Todo, User } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Get all todos
  async getAllTodos(): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      include: {
        User: true, // Include the user relation
      },
    });
  }

  // Retrieve user information by userId
  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  // Retrieve remaining todos of the logged-in user ordered by date and priority
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

  // Create a new todo
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
      },
    });
  }

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
      },
    });
  }

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
