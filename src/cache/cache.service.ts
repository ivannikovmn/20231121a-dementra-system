import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectCache } from '@nestjs/common';
import { User } from '../user/user.entity';

@Injectable()
export class CacheService {
  constructor(@InjectCache('user') private readonly userCache: Cache) {}

  async getUserFromCache(userId: number): Promise<User | null> {
    return this.userCache.get<User>(userId.toString());
  }

  async setUserToCache(userId: number, user: User): Promise<void> {
    await this.userCache.set<User>(userId.toString(), user, { ttl: 1800 }); // 30 minutes
  }
}
