import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TodoService } from './todo.service';
import { Todo } from '@prisma/client';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

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

  @Post()
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

  @Put(':id')
  async updateTodo(
    @Param('id') id: number,
    @Body() data: Todo,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.todoService.updateTodo(id, data);

      return res.status(200).json({ message: 'Success!', result: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }
}
