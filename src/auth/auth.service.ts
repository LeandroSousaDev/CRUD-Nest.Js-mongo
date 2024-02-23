import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserPayLoad } from './models/UserPayLoad';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private readonly jwt: JwtService) { }


    login(user: User): UserToken {
        const payLoad: UserPayLoad = {
            sub: user.id,
            email: user.email,
            name: user.name
        }

        const jwtToken = this.jwt.sign(payLoad)

        return {
            access_token: jwtToken
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (isPasswordValid) {
                return { ...user, password: undefined }
            }
        }
        throw new Error('email ou senha invalidos')
    }
}
