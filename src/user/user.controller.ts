/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Headers,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.viewUser(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: SignupDto,
    @Req() req,
    @Headers() headers,
  ) {
    return this.userService.updateUser(
      id,
      updateUserDto,
      req.user.sub,
      headers['x-platform'],
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }
}
