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

}
