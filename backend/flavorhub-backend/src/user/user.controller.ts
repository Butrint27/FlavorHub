import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import express from 'express';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    try {
      const user = await this.userService.create({
        ...createUserDto,
        avatar: avatar?.buffer,
      });

      return {
        success: true,
        message: 'User Created Successfully',
        data: user,
      };
    } catch (err) {
      console.error(err);
      throw new HttpException('Error Creating User', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.userService.findAll();
      return {
        success: true,
        data,
      };
    } catch {
      throw new HttpException('Error Fetching Users', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.userService.findOne(+id);
      return {
        success: true,
        data,
      };
    } catch {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // Return avatar image as binary
  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string, @Res() res: express.Response) {
    try {
      const user = await this.userService.findOne(+id);
      if (!user.avatar) {
        throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
      }

      res.setHeader('Content-Type', 'image/png'); // or detect dynamically
      res.send(user.avatar);
    } catch (err) {
      console.error(err);
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    try {
      const user = await this.userService.update(+id, {
        ...updateUserDto,
        avatar: avatar?.buffer,
      });
      return {
        success: true,
        message: 'User Updated Successfully',
        data: user,
      };
    } catch (err) {
      console.error(err);
      throw new HttpException('Error Updating User', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.userService.remove(+id);
      return {
        success: true,
        message: 'User Deleted Successfully',
      };
    } catch {
      throw new HttpException('Error Deleting User', HttpStatus.BAD_REQUEST);
    }
  }

}

