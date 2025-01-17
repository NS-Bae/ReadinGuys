import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto'; // LoginDto 임포트
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // 로거 생성

  constructor(
    private jwtService: JwtService, 
    private usersService: UsersService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any>
  {
    const { ip1: ip1, ip2: ip2 } = loginDto;
    const user = await this.usersService.findOne(ip1);//유저찾기
    
    if(!user)
    {
      throw new UnauthorizedException('I유저 정보가 올바르지 않습니다.');
    }
    
    const pw_result = await bcrypt.compare(ip2, user.password);

    if(!pw_result)
    {
      throw new UnauthorizedException('P유저정보가 올바르지 않습니다.');
    }
    if(!user.ok)
    {
      throw new UnauthorizedException('계정이 승인되지 않았습니다. 소속 학원으로 문의바랍니다.');
    }
    
    const { password, ...result } = user;
    this.logger.log('is it ok?' + user.ok, '검증 결과 값 : ' + JSON.stringify(result, null, 2));
    return result;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string, userInfo: string }> 
  {
    const user = await this.validateUser(loginDto);

    const payload = { id: user.id, userName: user.userName ,userType: user.userType, academyId: user.academyId, isItOk: user.ok };
    
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, userInfo: user };
  }
}
