import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Query,
    Patch,
    Post,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Ticket } from '@prisma/client';

import { TicketService } from './ticket.service';
import { CreateTicketDTO } from './dto/create-ticket.dto';
import { UpdateTicketDTO } from './dto/update-ticket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('ticket')
export class TicketController {

    constructor(private readonly ticketService: TicketService) { }

    /* GET /ticket */
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<Ticket[]> {
        return this.ticketService.findAll();
    }

    /* Get /ticket/filter */
    @Get('/filter')
    @UseGuards(JwtAuthGuard)
    async findAllByDateRange(
        @Query('from') from: string,
        @Query('to') to: string): Promise<Ticket[]> {
        return this.ticketService.findAllByDateRange(from, to);
    }

    /* Rating */
    @Get('/rating')
    async submitRating(
        @Query('Ticket', ParseIntPipe) Ticket: number,
        @Query('Rating', ParseIntPipe) Rating: number
    ) {
        return this.ticketService.rating(Ticket, Rating)
    }

    /* GET /ticket/:ticket */
    @Get(':ticket')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('ticket', ParseIntPipe) ticket: number): Promise<Ticket | null> {
        return this.ticketService.findOne(ticket)
    }

    /* POST /ticket */
    @Post()
    async create(@Body(ValidationPipe) data: CreateTicketDTO): Promise<Ticket> {
        return this.ticketService.create(data)
    }

    /* PATCH /ticket/:ticket */
    @Patch(':ticket')
    async update(@Param('ticket', ParseIntPipe) ticket: number, @Body(ValidationPipe) data: UpdateTicketDTO): Promise<Ticket> {
        return this.ticketService.update(ticket, data)
    }

    /* DELETE /ticket/:ticket */
    @Delete(':ticket')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('ticket', ParseIntPipe) ticket: number): Promise<Ticket> {
        return this.ticketService.delete(ticket);
    }
}
