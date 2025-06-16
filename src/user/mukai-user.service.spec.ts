import { Test, TestingModule } from '@nestjs/testing';
import { MukaiUserService } from './mukai-user.service';

describe('MukaiUserService', () => {
  let service: MukaiUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MukaiUserService],
    }).compile();

    service = module.get<MukaiUserService>(MukaiUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users', () => {
    const result = service.findAll();
    expect(result).toBeInstanceOf(Array);
  });

  it('should return a user by id', () => {
    const user = {
      id: 1,
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      age: 30,
      password: 'password',
      gender: 'Male',
    };
    service.create(user);
    const result = service.findOne(1);
    expect(result).toEqual(user);
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
    const result = service.create(user);
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
    service.create(user);
    const result = service.update(1, user);
    expect(result).toEqual(user);
  });

  it('should remove a user', () => {
    const user = {
      id: 1,
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      age: 30,
      password: 'password',
      gender: 'Male',
    };
    service.create(user);
    service.remove(1);
    const result = service.findOne(1);
    expect(result).toBeUndefined();
  });
});
