// src/app.module.ts
import { Module, CacheModule, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
import { CreateUserDto } from './user/dto/create-user.dto';
import { CacheService } from './cache/cache.service';
import { AxiosProxyController } from './axios-proxy/axios-proxy.controller';
import { AxiosProxyService } from './axios-proxy/axios-proxy.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'user',
    }),
    CacheModule.register({
      store: 'memory',
      ttl: 1800, // 30 minutes
    }),
    HttpModule,
  ],
  controllers: [UserController, AxiosProxyController],
  providers: [UserService, CreateUserDto, CacheService, AxiosProxyService],
})
export class AppModule {}
