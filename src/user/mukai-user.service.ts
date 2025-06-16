import { Injectable } from '@nestjs/common';
import { User } from './entities/mukai-user.entity';

@Injectable()
export class MukaiUserService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(user: User): User {
    this.users.push(user);
    return user;
  }

  update(id: number, user: User): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
      return this.users[index];
    }
    return null;
  }

  remove(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
