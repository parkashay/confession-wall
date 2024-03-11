import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Confession } from './entities/confession.entity';
import { ConfessionService } from './confession.service';
import { ConfessionInput, LikeInput, UnionResponse } from 'src/graphql';

@Resolver('UnionResponse')
export class ConfessionsResolver {
  constructor(protected confessionService: ConfessionService) {}

  // Queries and mutations for testing and demo purposes
  @Query()
  test(): string {
    return 'graphql is up and running';
  }

  @Query()
  testWithVariable(@Args('name') name: string): string {
    return `hello ${name}!`;
  }

  // Queries
  @Query()
  getAllConfessions(): Promise<Confession[]> {
    return this.confessionService.findAll();
  }

  // Mutations
  @ResolveField()
  __resolveType(value: UnionResponse) {
    if ('message' in value) return 'Error';
    return 'Confession';
  }
  @Mutation()
  async createConfession(@Args('confession') confession: ConfessionInput) {
    return await this.confessionService.create(confession);
  }

  @Mutation()
  deleteConfession(@Args('id') id: string) {
    return this.confessionService.delete(id);
  }

  @Mutation()
  likeConfession(@Args('input') input: LikeInput) {
    return this.confessionService.like(input);
  }
}
