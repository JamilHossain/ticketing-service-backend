import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() { email, password }: LoginDto) {

        return this.authService.login(email, password);

    }
}
