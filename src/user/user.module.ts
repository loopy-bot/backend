import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
