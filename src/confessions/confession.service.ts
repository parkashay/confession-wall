import { Repository } from 'typeorm';
import { Confession } from './entities/confession.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfessionInput, LikeInput, UnionResponse } from 'src/graphql';

@Injectable()
export class ConfessionService {
  constructor(
    @InjectRepository(Confession)
    private confessionRepository: Repository<Confession>,
  ) {}

  // retrieve all the confessions
  async findAll(): Promise<Confession[]> {
    return await this.confessionRepository.find();
  }

  // create a new confession
  async create(confession: ConfessionInput): Promise<UnionResponse> {
    try {
      return await this.confessionRepository.save(confession);
    } catch (err) {
      return {
        message:
          'There was a problem saving your confession. Message from the server: ' +
          (err as Error).message,
      };
    }
  }

  // delete a confession
  async delete(id: string): Promise<string> {
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
