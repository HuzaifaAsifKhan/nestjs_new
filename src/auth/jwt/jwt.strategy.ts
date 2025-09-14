import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../user.entity";
import { Repository } from "typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'huzaifaSecretKey'
        });
    }


    async validate(payload: any):Promise<User> {
        const username = payload.username;
        const user = await this.userRepository.findOne({where: {username}});
        if(!user){
            throw new UnauthorizedException();
        }
        return user; 
    }
}