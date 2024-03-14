import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Confession } from './entities/confession.entity';
import { ConfessionService } from './confession.service';
import { ConfessionInput, LikeInput, UnionResponse } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver('UnionResponse')
export class ConfessionsResolver {
  constructor(protected confessionService: ConfessionService) {}
  @ResolveField()
  __resolveType(value: UnionResponse) {
    return 'message' in value ? 'Error' : 'Confession';
  }

  // Queries
  @Query()
  getAllConfessions(): Promise<Confession[]> {
    return this.confessionService.findAll();
  }

  // Mutations
  @Mutation()
  @UseGuards(AuthGuard)
  async createConfession(
    @Context() context: any,
    @Args('confession') confession: ConfessionInput,
  ) {
    return await this.confessionService.create(context, confession);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  deleteConfession(@Context() context: any, @Args('id') id: string) {
    return this.confessionService.delete(context, id);
  }

  @Mutation()
  likeConfession(@Args('input') input: LikeInput) {
    return this.confessionService.like(input);
  }
}
