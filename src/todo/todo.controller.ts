import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TodoService } from './todo.service';
import { Todo } from '@prisma/client';
import { JwtAuthGuard } from '../authentication/auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  /**
   * we have used get decorator to get all the todo's list
   * so the API URL will be
   * GET http://localhost:3000/todo
   */
  @Get()
  async getAllTodos(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const result = await this.todoService.getAllTodos();
      return res
        .status(200)
        .json({ message: 'Success fetch data!', result: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }

  /**
   * we have used get decorator with id param to get id from request
   * so the API URL will be
   * GET http://localhost:3000/todo/:id
   * @returns user with his Todos ordered by date and priority
   */
  @Get('remaining/:userId')
  @UseGuards(JwtAuthGuard)
  async getRemainingTodosForUser(
    @Param('userId') userId: number,
  ): Promise<Todo[]> {
    return this.todoService.getRemainingTodosForUser(userId);
  }

  /**
   * Post decorator represents method of request as we have used post decorator the method
   * of this API will be post.
   * so the API URL to create Todo will be
   * POST http://localhost:3000/todo
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createTodo(
    @Body() postData: Todo,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Todo>> {
    try {
      const result = await this.todoService.createTodo(postData);
      return res.status(200).json({ message: 'Success!', result: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }

  /**
   * we have used put decorator with id passed in the body
   * so the API URL will be
   * PUT http://localhost:3000/todo
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  async updateTodo(
    @Body() data: { id: number; todo: Todo },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { id, todo } = data;
      const result = await this.todoService.updateTodo(id, todo);

      return res
        .status(200)
        .json({ message: 'Todo updated successfully!', data_updated: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }

  /**
   * we have used Delete decorator with id param to get id from request
   * so the API URL will be
   * DELETE http://localhost:3000/todo/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTodo(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.todoService.deleteTodo(id);

      if ('message' in result) {
        // Handle the case where the todo was not found
        return res.status(404).json({ message: result.message });
      }

      return res
        .status(200)
        .json({ message: 'Todo delted successfully!', data_deleted: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }
}
