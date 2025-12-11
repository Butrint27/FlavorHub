import { BadRequestException, Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // -------------------------
  // CREATE USER
  // -------------------------
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.password = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.save(user);
  }

  // -------------------------
  // FIND ALL USERS
  // -------------------------
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // -------------------------
  // FIND ONE USER
  // -------------------------
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  // -------------------------
  // UPDATE USER
  // -------------------------
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  // -------------------------
  // DELETE USER
  // -------------------------
  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  // -------------------------
  // REGISTER
  // -------------------------
  async register(dto: RegisterDto) {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ fullName: dto.fullName, email: dto.email, password: hashedPassword });
    await this.userRepository.save(user);

    return { message: 'User registered successfully' };
  }

  // -------------------------
  // LOGIN
  // -------------------------
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.generateTokens(user);

    // Save hashed refresh token
    user.refreshToken = await bcrypt.hash(tokens.refresh_token, 10);
    await this.userRepository.save(user);

    return tokens;
  }

  // -------------------------
  // REFRESH TOKEN
  // -------------------------
  async refreshToken(refreshToken: string) {
    try {
      const payload: any = await this.jwtService.verifyAsync(refreshToken, {
        secret: '8ec025f546fde560c7f24f32190502d46050c94e571f419a59e05ec91441086f44bc881a8507f0eebc834cdb282d80652e7531f77b74daf85de1fcdac9669315',
      });

      const user = await this.findOne(payload.sub);
      if (!user || !user.refreshToken) throw new UnauthorizedException();

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException();

      const tokens = await this.generateTokens(user);
      user.refreshToken = await bcrypt.hash(tokens.refresh_token, 10);
      await this.userRepository.save(user);

      return tokens;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // -------------------------
  // GENERATE ACCESS & REFRESH TOKENS
  // -------------------------
  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, fullName: user.fullName };

    const access_token = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    return { access_token, refresh_token };
  }
}

