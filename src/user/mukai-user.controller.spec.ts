import { Test, TestingModule } from '@nestjs/testing';
import { MukaiUserController } from './mukai-user.controller';
import { MukaiUserService } from './mukai-user.service';

describe('MukaiUserController', () => {
  let controller: MukaiUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MukaiUserController],
      providers: [MukaiUserService],
    }).compile();

    controller = module.get<MukaiUserController>(MukaiUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', () => {
    const result = controller.findAll();
    expect(result).toBeInstanceOf(Array);
  });

  it('should return a user by id', () => {
    const result = controller.findOne(1);
    expect(result).toBeDefined();
  });

  it('should create a user', () => {
    const user = {
      id: 1,
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      age: 30,
      password: 'password',
      gender: 'Male',
    };
    const result = controller.create(user);
    expect(result).toEqual(user);
  });

  it('should update a user', () => {
    const user = {
      id: 1,
      name: 'Updated User',
      username: 'updateduser',
      email: 'updated@example.com',
      age: 31,
      password: 'newpassword',
      gender: 'Female',
    };
    const result = controller.update(1, user);
    expect(result).toEqual(user);
  });

  it('should remove a user', () => {
    controller.remove(1);
    const result = controller.findOne(1);
    expect(result).toBeUndefined();
  });
});
