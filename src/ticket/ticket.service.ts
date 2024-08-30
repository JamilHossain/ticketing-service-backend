import { ConflictException, Injectable, Res } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Ticket } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDTO } from './dto/create-ticket.dto';
import { UpdateTicketDTO } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
    constructor(private db: PrismaService) { }

    /* Rating */
    async rating(Ticket: number, Rating: number): Promise<Ticket> {
        const data = await this.db.ticket.findUnique({
            where: {
                Ticket
            }
        })

        if (!data) {
            return await this.db.ticket.create({
                data: {
                    Ticket,
                    Rating
                }
            })
        }

        return await this.db.ticket.update({
            where: {
                Ticket
            },
            data: {
                Rating
            }
        })
    }

    /* GET /ticket */
    async findAll(): Promise<Ticket[]> {
        return await this.db.ticket.findMany()
    }

    /* Get /ticket/filter */
    async findAllByDateRange(from: string, to: string): Promise<Ticket[]> {
        console.log("from", from);
        console.log("to", to)
        return await this.db.ticket.findMany({
            where: {
                updatedAt: {
                    gte: new Date(from), // Ensure it's in the correct format
                    lte: new Date(to),
                },
            },
        });
    }

    /* GET /ticket/:ticket */
    async findOne(ticket: number): Promise<Ticket | null> {
        const data = await this.db.ticket.findUnique({
            where: {
                Ticket: ticket
            }
        })

        if (!data) {
            throw new NotFoundException("Ticket Not Found!")
        }

        return data;
    }

    /* POST /ticket */
    async create(data: CreateTicketDTO): Promise<Ticket> {

        const ticketExit = await this.db.ticket.findUnique({
            where: {
                Ticket: data.Ticket
            }
        })

        if (ticketExit) {
            throw new ConflictException("Ticket Already Exits!")
        }

        const res = await this.db.ticket.create({
            data: {
                Ticket: data.Ticket,
                Rating: data.Rating
            }
        })

        return res;
    }

    /* PATCH /ticket/:ticket */
    async update(ticket: number, data: UpdateTicketDTO): Promise<Ticket> {
        const ticketExit = await this.db.ticket.findUnique({
            where: {
                Ticket: ticket
            }
        })

        if (!ticketExit) {
            throw new NotFoundException("Ticket Not Found!")
        }

        const res = await this.db.ticket.update({
            where: {
                Ticket: ticket
            },
            data: {
                Rating: data.Rating
            }
        })
        return res;
    }

    /* DELETE /ticket/:ticket */
    async delete(ticket: number): Promise<Ticket> {
        const ticketExit = await this.db.ticket.findUnique({
            where: {
                Ticket: ticket
            }
        })

        if (!ticketExit) {
            throw new NotFoundException("Ticket Not Found!")
        }

        const res = await this.db.ticket.delete({
            where: {
                Ticket: ticket
            }
        })

        return res;
    }

}
