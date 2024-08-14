import { Module } from '@nestjs/common';

import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers:[TicketController],
    providers:[TicketService],
    imports: [PrismaModule],
    exports: [TicketService],
})
export class TicketModule {}
