import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BullQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CacheService } from 'src/cache/cache.service'; // Импортируем CacheService
import { CreateUserDto } from './dto/create-user.dto'; // Импортируем CreateUserDto

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @BullQueue('user') private readonly userQueue: Queue, // Ensure it's using Queue
    private readonly cacheService: CacheService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('ERR_USER_EMAIL_EXISTS');
    }

    const newUser = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(newUser);

    // Schedule the Bull job to update the user status after 10 seconds
    this.userQueue.add({ userId: savedUser.id }, { delay: 10000 });

    return savedUser;
  }

  async getUserById(userId: number): Promise<User> {
    const cachedUser = await this.cacheService.getUserFromCache(userId);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('ERR_USER_NOT_FOUND');
    }

    // Cache the user data for 30 minutes
    await this.cacheService.setUserToCache(userId, user);

    return user;
  }
}
