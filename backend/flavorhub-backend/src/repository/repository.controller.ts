import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createDto: CreateRepositoryDto, @UploadedFile() file?: Express.Multer.File) {
    try {
      if (file) createDto.image = file.buffer;
      const repo = await this.repositoryService.create(createDto);
      return { success: true, message: 'Repository Created Successfully', data: repo };
    } catch (err) {
      console.error(err);
      throw new HttpException('Error Creating Repository', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.repositoryService.findAll();
      return { success: true, data };
    } catch (err) {
      console.error(err);
      throw new HttpException('Error Fetching Repositories', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.repositoryService.findOne(+id);
      return { success: true, data };
    } catch (err) {
      if (err instanceof NotFoundException) throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      console.error(err);
      throw new HttpException('Error fetching repository', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateRepositoryDto, @UploadedFile() file?: Express.Multer.File) {
    try {
      if (file) updateDto.image = file.buffer;
      const repo = await this.repositoryService.update(+id, updateDto);
      return { success: true, message: 'Repository Updated Successfully', data: repo };
    } catch (err) {
      console.error(err);
      throw new HttpException('Error Updating Repository', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.repositoryService.remove(+id);
      return { success: true, message: 'Repository Deleted Successfully' };
    } catch (err) {
      console.error(err);
      throw new HttpException('Error Deleting Repository', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    try {
      const data = await this.repositoryService.findByUserId(Number(userId));
      return { success: true, data };
    } catch (err) {
      if (err instanceof NotFoundException) throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      console.error(err);
      throw new HttpException('Error fetching repositories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:repositoryId/user/:userId')
  async updateRepositoryByUserId(@Param('repositoryId') repositoryId: string, @Param('userId') userId: string, @Body() updateDto: UpdateRepositoryDto) {
    try {
      const updatedRepo = await this.repositoryService.updateRepoByUserId(Number(userId), Number(repositoryId), updateDto);
      return { success: true, data: updatedRepo };
    } catch (err) {
      console.error(err);
      throw new HttpException('Error updating repository', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:repositoryId/user/:userId')
  async deleteRepositoryByUserId(@Param('repositoryId') repositoryId: string, @Param('userId') userId: string) {
    try {
      await this.repositoryService.deleteRepoByUserId(Number(userId), Number(repositoryId));
      return { success: true, message: 'Repository deleted successfully' };
    } catch (err) {
      console.error(err);
      throw new HttpException('Error deleting repository', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}




