import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // CREATE COMMENT
  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  // GET ALL COMMENTS
  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  // GET SINGLE COMMENT BY ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  // GET COMMENTS BY REPOSITORY ID
  @Get('repository/:repositoryId')
  findByRepo(@Param('repositoryId', ParseIntPipe) repositoryId: number): Promise<Comment[]> {
    return this.commentsService.findByRepoId(repositoryId);
  }

  // UPDATE COMMENT
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto);
  }

  // DELETE COMMENT
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.commentsService.remove(id);
  }
}

