import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CacheService } from '../cache/cache.service';
import { BullModule, getQueueToken } from '@nestjs/bull';
//import { BullQueue } from 'bull';
// import { BullQueue } from '@nestjs/bull';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  
  //@BullQueue('user') private readonly userQueue: BullQueue;
  //@BullQueue('user') private readonly userQueue: Job;

  // let userQueue: BullQueue;
  // private readonly userQueue: BullQueue;
  // private userQueue: BullQueue;
  public readonly userQueue: BullQueue;



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.forRoot({}), BullModule.registerQueue({ name: 'user' })],
      providers: [
        UserService,
        CacheService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getQueueToken('user'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userQueue = module.get<BullQueue>(getQueueToken('user'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const userEntity = new User();
      userEntity.name = createUserDto.name;
      userEntity.email = createUserDto.email;
      userEntity.password = createUserDto.password;

      jest.spyOn(userRepository, 'findOne').mockReturnValue(Promise.resolve(null));
      jest.spyOn(userRepository, 'create').mockReturnValue(userEntity);
      jest.spyOn(userRepository, 'save').mockReturnValue(Promise.resolve(userEntity));
      jest.spyOn(userQueue, 'add');

      const result = await service.createUser(createUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(userEntity);
      expect(userQueue.add).toHaveBeenCalledWith({ userId: userEntity.id }, { delay: 10000 });

      expect(result).toEqual(userEntity);
    });

    it('should throw an error if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const existingUser = new User();
      existingUser.id = 1;
      existingUser.name = createUserDto.name;
      existingUser.email = createUserDto.email;
      existingUser.password = createUserDto.password;

      jest.spyOn(userRepository, 'findOne').mockReturnValue(Promise.resolve(existingUser));

      await expect(service.createUser(createUserDto)).rejects.toThrowError('ERR_USER_EMAIL_EXISTS');
    });
  });
});
