import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Confession } from 'src/confessions/entities/confession.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Confession, User])],
  controllers: [],
  providers: [UserResolver, UserService],
})
export class UserModule {}
