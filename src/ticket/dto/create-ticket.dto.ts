import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTicketDTO {
    @IsNumber()
    @IsNotEmpty()
    Ticket: number;

    @IsNumber()
    @IsNotEmpty()
    Rating: number;
}