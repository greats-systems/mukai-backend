import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MukaiUserService } from './mukai-user.service';
import { User } from './entities/mukai-user.entity';

@Controller('mukai-users')
export class MukaiUserController {
  constructor(private readonly mukaiUserService: MukaiUserService) {}

  @Get()
  findAll(): User[] {
    return this.mukaiUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): User {
    return this.mukaiUserService.findOne(id);
  }

  @Post()
  create(@Body() user: User): User {
    return this.mukaiUserService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: User): User {
    return this.mukaiUserService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): void {
    this.mukaiUserService.remove(id);
  }
}
