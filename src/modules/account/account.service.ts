import { Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
  @InjectRepository(Account)
  private readonly userRepository: Repository<Account>;

  saveLastSessionId(id: string, lastSessionId: string) {
    this.userRepository.save({ id, lastSessionId });
  }

  getLastSessionId(id: string) {
    return this.userRepository.findOne({ where: { id } }).then((user) => user.lastSessionId);
  }
}
