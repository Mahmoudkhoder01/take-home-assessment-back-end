import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
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
}
