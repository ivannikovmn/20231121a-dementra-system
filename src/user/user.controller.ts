import { Get, Param } from '@nestjs/common';
import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.createUser(createUserDto);
      return { statusCode: HttpStatus.CREATED, message: 'User created successfully', user: result };
    } catch (error) {
      throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const result = await this.userService.getUserById(Number(id));
      return { statusCode: HttpStatus.OK, message: 'User retrieved successfully', user: result };
    } catch (error) {
      throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }
}

