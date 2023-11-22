import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
// import { BullQueue } from '@nestjs/bull'; // Comment or remove this line
import { Queue } from 'bull';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
