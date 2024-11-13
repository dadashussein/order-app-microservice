import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }

  @Post()
  async create(@Body() request) {
    return this.userService.createUser(request);
  }
}
