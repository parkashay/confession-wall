import { Repository } from 'typeorm';
import { Confession } from './entities/confession.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfessionInput } from 'src/graphql';
import { User } from 'src/auth/entities/user.entity';

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
    try {
      const confession = await this.confessionRepository.findOne({
        where: { id },
        relations: { user: true },
      });
      if (!confession) throw new Error('Confession could not be found!');
      if (context.req.user.id !== confession.user.id)
        throw new Error('The confession does not belong to the current user!');
      await this.confessionRepository.delete({ id });
      return 'Confession deleted successfully!';
    } catch (err) {
      return (
        'Confession could not be deleted. Reason: ' + (err as Error).message
      );
    }
  }
}
