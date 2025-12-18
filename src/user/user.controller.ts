import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Controller('user')
// @ApiExcludeController()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() createUserDto: SignupDto) {
    return this.userService.createUser(createUserDto);
  }

  // @Get('seed-database')
  // seedDatabase() {
  //   return this.userService.seedDatabase();
  // }

  @Get()
  findAll() {
    return this.userService.findAllUser();
  }

  @Get('coop-managers')
  findAllCoopManagers() {
    return this.userService.findAllCoopManagers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.viewUser(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: SignupDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }
}
