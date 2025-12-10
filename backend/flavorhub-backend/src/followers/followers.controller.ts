import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post()
  create(@Body() dto: CreateFollowerDto) {
    return this.followersService.create(dto);
  }

  @Get()
  findAll() {
    return this.followersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followersService.findOne(+id);
  }

  // Followers
  @Get('user/:userId/followers')
  getFollowersByUserId(@Param('userId') userId: string) {
    return this.followersService.getFollowersByUserId(+userId);
  }

   // Following
  @Get('user/:userId/following')
  getFollowingByUserId(@Param('userId') userId: string) {
     return this.followersService.getFollowingByUserId(+userId);
   }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFollowerDto) {
    return this.followersService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followersService.remove(+id);
  }
}


