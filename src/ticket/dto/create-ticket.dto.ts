import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTicketDTO {
    @IsNumber()
    @IsNotEmpty()
    Ticket: number;

    @IsNumber()
    @IsNotEmpty()
    Rating: number;

    @IsOptional()
    TicketUrl:string;
}