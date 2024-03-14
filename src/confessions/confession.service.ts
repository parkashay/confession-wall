import { Repository } from 'typeorm';
import { Confession } from './entities/confession.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfessionInput, LikeInput, UnionResponse } from 'src/graphql';
import { User } from 'src/auth/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class ConfessionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Confession)
    private confessionRepository: Repository<Confession>,
  ) {}

  // retrieve all the confessions
  async findAll(): Promise<Confession[]> {
    return await this.confessionRepository.find({ relations: ['user'] });
  }

  // create a new confession
  async create(context: any, confession: ConfessionInput): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: context.req.user.id,
        },
      });
      if (!user) throw new UnauthorizedException();
      return await this.confessionRepository.save({
        ...confession,
        user,
      });
    } catch (err) {
      return {
        message:
          'There was a problem saving your confession. Message from the server: ' +
          (err as Error).message,
      };
    }
  }

  // delete a confession
  async delete(context: any, id: string): Promise<string> {
    const res = await this.confessionRepository.delete({ id });
    if (!res.affected)
      return 'The confession could not be found to be deleted !';
    return 'The confession has been deleted !';
  }

  // like or dislike
  async like(input: LikeInput): Promise<UnionResponse> {
    const res = await this.confessionRepository.update(
      { id: input.id },
      { likes: () => `likes + ${input.type}` },
    );
    if (res.affected)
      return this.confessionRepository.findOne({
        where: {
          id: input.id,
        },
      });

    return { message: 'The confession could not be found !' };
  }
}
