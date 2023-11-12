import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaService } from '../prisma.service';
import { Todo } from '@prisma/client';

const mockPrismaService = {
  todo: {
    findMany: jest.fn(),
  },
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, TodoService],
      controllers: [TodoController],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of todos with user information', async () => {
    // Create mock data for todos with user information
    const mockTodos: Todo[] = [
      {
        id: 1,
        description: 'Todo 1',
        priority: 'LOW',
        userId: 1,
        date: '2015-11-04',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Mock the behavior of the PrismaService's findMany method
    mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);

    // Call the getAllTodos method
    const result = await service.getAllTodos();

    // Expectations
    expect(result).toEqual(mockTodos);
  });
});
