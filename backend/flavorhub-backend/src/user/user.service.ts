import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  jwtService: any;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwt: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const saltRounds = 10;
    user.password = await require('bcrypt').hash(createUserDto.password, saltRounds);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const userData = await this.userRepository.findOneBy({ id });
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    return userData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOne(id);
    const userData = this.userRepository.merge(existingUser, updateUserDto);

    if (updateUserDto.password) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return await this.userRepository.save(userData);
  }

  async remove(id: number): Promise<User> {
    const existingUser = await this.findOne(id);
    return await this.userRepository.remove(existingUser);
  }

 // ====================
  // REGISTER
  // ====================
  async register(dto: RegisterDto) {
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashed,
    });

    await this.userRepository.save(user);

    return { message: 'User registered successfully' };
  }

  // ====================
  // LOGIN
  // ====================
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    // 🔥 Generate tokens
    const tokens = await this.generateTokens(user);

    // 🔐 Save hashed refresh token
    const hashedRt = await bcrypt.hash(tokens.refresh_token, 10);
    user.refreshToken = hashedRt;
    await this.userRepository.save(user);

    return tokens;
  }

  // ====================
  // TOKEN GENERATION
  // ====================
  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
    });

    const refresh_token = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn: '7d' },
    );

    return {
      access_token,
      refresh_token,
    };
  }

}
