import { Module } from '@nestjs/common';
import {
  ConfessionsResolver,
} from './confessions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Confession } from './entities/confession.entity';
import { ConfessionService } from './confession.service';

const providers = [ConfessionsResolver, ConfessionService];
@Module({
  imports: [TypeOrmModule.forFeature([Confession])],
  controllers: [],
  providers,
})
export class ConfessionsModule {}
