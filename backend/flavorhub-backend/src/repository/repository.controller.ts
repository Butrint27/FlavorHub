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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createDto: CreateRepositoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) createDto.image = file.buffer;

      const repo = await this.repositoryService.create(createDto);
      return {
        success: true,
        message: 'Repository Created Successfully',
        data: repo,
      };
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
      throw new HttpException('Error Fetching Repositories', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.repositoryService.findOne(+id);
      return { success: true, data };
    } catch (err) {
      throw new HttpException('Repository Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRepositoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) updateDto.image = file.buffer;

      const repo = await this.repositoryService.update(+id, updateDto);
      return {
        success: true,
        message: 'Repository Updated Successfully',
        data: repo,
      };
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
      throw new HttpException('Error Deleting Repository', HttpStatus.BAD_REQUEST);
    }
  }
}



