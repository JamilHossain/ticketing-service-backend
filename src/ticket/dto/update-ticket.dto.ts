import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateTicketDTO {
    @IsNumber()
    @IsNotEmpty()
    Rating: number;
}
