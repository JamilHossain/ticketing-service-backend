import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /* GET /user */
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    /* GET /user/:id */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
        return this.userService.findOne(id)
    }

    /* POST /user */
    @Post()
    async create(@Body(ValidationPipe) user: CreateUserDTO): Promise<User> {
        return this.userService.create(user)
    }

    /* PATCH /user/:id */
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) data: UpdateUserDTO): Promise<User> {
        return this.userService.update(id, data)
    }

    /* DELETE /user/:id */
    @Delete()
    @UseGuards(JwtAuthGuard)
    async delete(@Body('ids') ids: number[]): Promise<{ count: number }> {
        return this.userService.delete(ids);
    }
}

