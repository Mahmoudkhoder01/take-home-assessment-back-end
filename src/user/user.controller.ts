import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Delete,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const result = await this.userService.getAllUsers();
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
  async postUser(
    @Body() postData: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<User>> {
    try {
      const result = await this.userService.createUser(postData);
      return res.status(200).json({ message: 'Success!', result: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }

  @Get(':id')
  async getUser(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<User>> {
    try {
      const result = await this.userService.getUserById(id);
      return res
        .status(200)
        .json({ message: 'User data fetched!', result: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<User>> {
    try {
      const result = await this.userService.deleteUser(id);

      if ('message' in result) {
        // Handle the case where the user was not found
        return res.status(404).json({ message: result.message });
      }

      return res
        .status(200)
        .json({ message: 'User delted successfully!', result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() data: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<User>> {
    try {
      const result = await this.userService.updateUser(id, data);

      if ('message' in result) {
        // Handle the case where the email is already in use
        return res.status(400).json({ message: result.message });
      }
      // Handle the case where the user was successfully updated
      return res
        .status(200)
        .json({ message: 'User updated successfully!', result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }
}