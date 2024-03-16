import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Confession } from 'src/confessions/entities/confession.entity';
import {
  ConfessionsByUser,
  Error,
} from 'src/graphql';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Confession)
    private confessionsRepository: Repository<Confession>,
  ) {}
  async getUserConfessions(context: any): Promise<ConfessionsByUser> {
    try {
      return {
        confessions: await this.confessionsRepository.find({
          where: {
            user: {
              id: context.req.id,
            },
          },
        }),
      };
    } catch (err) {
      return { message: (err as Error).message };
    }
  }
}
