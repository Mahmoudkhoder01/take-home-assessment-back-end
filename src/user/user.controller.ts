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
  UseGuards,
} from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../authentication/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * we have used get decorator to get all the user's list
   * so the API URL will be
   * GET http://localhost:3000/user
   */
  @Get()
  @UseGuards(JwtAuthGuard)
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

  /**
   * Post decorator represents method of request as we have used post decorator the method
   * of this API will be post.
   * so the API URL to create User will be
   * POST http://localhost:3000/user
   */
  @Post()
  async postUser(
    @Body() postData: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<User>> {
    try {
      const existingUserWithSameEmail = await this.userService.getUserByEmail(
        postData.email,
      );

      // Check if the new email is already in use by another user
      if (existingUserWithSameEmail) {
        // Handle the case where the email is already in use
        return res
          .status(400)
          .json({ message: 'Email is already in use by another user.' });
      }

      const result = await this.userService.createUser(postData);

      return res.status(200).json({ message: 'Success!', result: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }

  /**
   * we have used get decorator with id param to get id from request
   * so the API URL will be
   * GET http://localhost:3000/user/:id
   */
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

  /**
   * we have used put decorator with id param to get id from request
   * so the API URL will be
   * PUT http://localhost:3000/user/:id
   */
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
        .json({ message: 'User updated successfully!', data_updated: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }

  /**
   * we have used Delete decorator with id param to get id from request
   * so the API URL will be
   * DELETE http://localhost:3000/user/:id
   */
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
        .json({ message: 'User delted successfully!', data_deleted: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error!', error: error.message });
    }
  }
}
