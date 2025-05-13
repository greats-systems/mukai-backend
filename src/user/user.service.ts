import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import { ProfileSeeder } from './profile_seeder.service';
// private readonly userRepository: Repository<User>,
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly postgresrest: PostgresRest, private readonly profileSeeder: ProfileSeeder) { }


  async seedDatabase() {
    await this.profileSeeder.seedProfiles();
  }
  
  async createUser(createUserDto: CreateUserDto): Promise<User | undefined> {
    const user: User = new User();
    user.name = createUserDto.name;
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.gender = createUserDto.gender;

    const new_user = await this.postgresrest.from('profiles').insert(user).single();
    if (new_user.data) {
      return new_user
    } else {
      return;
    }
  }

  async findAllUser(): Promise<User[]> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .select('*');

      if (error) {
        this.logger.error('Error fetching users', error);
        return [];
      }

      return data as User[];
    } catch (error) {
      this.logger.error('Exception in findAllUser', error);
      return [];
    }
  }

  async viewUser(id: number): Promise<User | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching user ${id}`, error);
        return null;
      }

      return data as User;
    } catch (error) {
      this.logger.error(`Exception in viewUser for id ${id}`, error);
      return null;
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .update({
          name: updateUserDto.name,
          age: updateUserDto.age,
          email: updateUserDto.email,
          username: updateUserDto.username,
          password: updateUserDto.password
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error updating user ${id}`, error);
        return null;
      }

      return data as User;
    } catch (error) {
      this.logger.error(`Exception in updateUser for id ${id}`, error);
      return null;
    }
  }

  async removeUser(id: number): Promise<boolean> {
    try {
      const { error } = await this.postgresrest
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error deleting user ${id}`, error);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in removeUser for id ${id}`, error);
      return false;
    }
  }
}