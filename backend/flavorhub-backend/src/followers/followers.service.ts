import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follower } from './entities/follower.entity';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Follower)
    private readonly followerRepo: Repository<Follower>,
  ) {}

  // Create a new follower relationship
  async create(dto: CreateFollowerDto): Promise<Follower> {
    const { userId, followsUserId } = dto;

    if (userId === followsUserId) {
      throw new BadRequestException('User cannot follow themselves');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const followsUser = await this.userRepo.findOne({ where: { id: followsUserId } });
    if (!followsUser) throw new NotFoundException('User to follow not found');

    const existing = await this.followerRepo.findOne({
      where: { user: { id: userId }, followsUser: { id: followsUserId } },
    });

    if (existing) {
      throw new BadRequestException('Already following this user');
    }

    const follower = this.followerRepo.create({ user, followsUser });
    return this.followerRepo.save(follower);
  }

  // Get all follower relationships
  async findAll(): Promise<Follower[]> {
    return this.followerRepo
      .createQueryBuilder('follower')
      .leftJoinAndSelect('follower.user', 'user')
      .leftJoinAndSelect('follower.followsUser', 'followsUser')
      .getMany();
  }

  // Get one follower by ID
  async findOne(id: number): Promise<Follower> {
    const follower = await this.followerRepo
      .createQueryBuilder('follower')
      .leftJoinAndSelect('follower.user', 'user')
      .leftJoinAndSelect('follower.followsUser', 'followsUser')
      .where('follower.id = :id', { id })
      .getOne();

    if (!follower) throw new NotFoundException('Follower not found');
    return follower;
  }

  // Get all followers (users who follow this user)
async getFollowersByUserId(userId: number): Promise<Follower[]> {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  return this.followerRepo
    .createQueryBuilder('follower')
    .leftJoinAndSelect('follower.user', 'user')           // The follower
    .leftJoinAndSelect('follower.followsUser', 'followsUser') // The followed user
    .where('follower.followsUser = :userId', { userId })  // Important: filter by followsUser
    .getMany();
}

// Get all following (users this user is following)
async getFollowingByUserId(userId: number): Promise<Follower[]> {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  return this.followerRepo
    .createQueryBuilder('follower')
    .leftJoinAndSelect('follower.user', 'user')           // The follower
    .leftJoinAndSelect('follower.followsUser', 'followsUser') // The followed user
    .where('follower.user = :userId', { userId })        // Important: filter by user
    .getMany();
}



  // Update a follower relationship
  async update(id: number, dto: UpdateFollowerDto): Promise<Follower> {
    const follower = await this.followerRepo.findOne({ where: { id } });
    if (!follower) throw new NotFoundException('Follower not found');

    const { userId, followsUserId } = dto;

    if (userId && followsUserId) {
      if (userId === followsUserId) {
        throw new BadRequestException('User cannot follow themselves');
      }

      const user = await this.userRepo.findOne({ where: { id: userId } });
      const followsUser = await this.userRepo.findOne({ where: { id: followsUserId } });
      if (!user || !followsUser) throw new NotFoundException('User not found');

      follower.user = user;
      follower.followsUser = followsUser;
    }

    return this.followerRepo.save(follower);
  }

  // Remove a follower relationship
  async remove(id: number): Promise<void> {
    const follower = await this.followerRepo.findOne({ where: { id } });
    if (!follower) throw new NotFoundException('Follower not found');

    await this.followerRepo.remove(follower);
  }
}




