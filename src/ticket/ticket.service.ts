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
    async rating(Ticket: number, Rating: number, @Res() res): Promise<Ticket> {
        const data = await this.db.ticket.findUnique({
            where: {
                Ticket
            }
        })

        const htmlTemplate = (title: string) => `
                    <html lang="en">
                        <head>
                            <meta charset="utf-8" />
                            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <title></title>
                            <link href='https://fonts.googleapis.com/css?family=Lato:300,400|Montserrat:700' rel='stylesheet' type='text/css'>
                            <style>
                                @import url(//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css);
                                @import url(//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css);
                            </style>
                            <link rel="stylesheet" href="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/default_thank_you.css">
                            <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/jquery-1.9.1.min.js"></script>
                            <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/html5shiv.js"></script>
                        </head>
                        <body>
                            <header class="site-header" id="header">
                                <h1 class="site-header__title" data-lead-id="site-header-title">THANK YOU!</h1>
                            </header>

                            <div class="main-content">
                                <i class="fa fa-check main-content__checkmark" id="checkmark"></i>
                                <p class="main-content__body" data-lead-id="main-content-body">Thanks a bunch for filling that out. It means a lot to us, just like you do! We really appreciate you giving us a moment of your time today. Thanks for being you.</p>
                            </div>

                            <footer class="site-footer" id="footer">
                                <p class="site-footer__fineprint" id="fineprint">Copyright ©2014 | All Rights Reserved</p>
                            </footer>
                        </body>
                    </html>
                `;

        if (!data) {
            await this.db.ticket.create({
                data: {
                    Ticket,
                    Rating
                }
            })
            res.setHeader('Content-Type', 'text/html');
            res.send(htmlTemplate("Feedback Submitted"));
            return;
        }

        await this.db.ticket.update({
            where: {
                Ticket
            },
            data: {
                Rating
            }
        })

        res.setHeader('Content-Type', 'text/html');
        res.send(htmlTemplate("Feedback Submitted"));
    }

    /* GET /ticket */
    async findAll(): Promise<Ticket[]> {
        return await this.db.ticket.findMany()
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
