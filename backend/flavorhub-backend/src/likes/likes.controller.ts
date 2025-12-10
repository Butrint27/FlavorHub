import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likesService.update(+id, updateLikeDto);
  }

  @Patch('user/:userId')
  updateByUserId(
  @Param('userId') userId: string,
  @Body() updateLikeDto: UpdateLikeDto
   ) {
     return this.likesService.updateLikeByUserId(+userId, updateLikeDto);
   }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(+id);
  }

  // ⭐ NEW: Get all likes by a specific user
  @Get('user/:userId')
  findLikesByUser(@Param('userId') userId: string) {
    return this.likesService.findLikesByUserId(+userId);
  }
}

