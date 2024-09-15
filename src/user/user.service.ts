import { ConflictException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
    constructor(private db: PrismaService) { }

    /* GET /user */
    async findAll(): Promise<User[]> {
        return await this.db.user.findMany()
    }

    /* GET /user/:id */
    async findOne(id: number): Promise<User | null> {
        const user = await this.db.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            throw new NotFoundException("User Not Found!")
        }

        return user;
    }

    /* POST /user */
    async create(user: CreateUserDTO): Promise<User> {

        const userExit = await this.db.user.findUnique({
            where: {
                email: user.email
            }
        })

        if (userExit) {
            throw new ConflictException("User Already Exits!")
        }

        const hashedPassword = await bcrypt.hash(
            user.password,
            roundsOfHashing,
        );

        user.password = hashedPassword

        const res = await this.db.user.create({
            data: user
        })

        return res;
    }

    /* PATCH /user/:id */
    async update(id: number, data: UpdateUserDTO): Promise<User> {
        const user = await this.db.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            throw new NotFoundException("User Not Found!")
        }

        data.password = await bcrypt.hash(
            data.password,
            roundsOfHashing,
        );

        const res = await this.db.user.update({
            where: {
                id
            },
            data
        })
        
        return res;
    }

    /* DELETE /user/:id */
    async delete(ids: number[]): Promise<{ count: number }> {

        const res = await this.db.user.deleteMany({
            where: {
                id: {
                    in: ids,
                }
            }
        })

        return res;
    }

}

