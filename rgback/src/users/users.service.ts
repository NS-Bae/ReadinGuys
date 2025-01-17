import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(user: User): Promise<User> 
  {
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> 
  {
    const users = this.usersRepository.find();
    this.logger.debug('Fetched users:', users);
    return users;
  }

  async findOne(id: string): Promise<User> 
  {
    const user = await this.usersRepository.findOne({ where : { id } });
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User>
  {
    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void>
  {
    await this.usersRepository.delete(id);
  }
}