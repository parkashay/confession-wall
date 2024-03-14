import { Context, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver('ConfessionsByUser')
export class UserResolver {
  constructor(private userService: UserService) {}

  @ResolveField()
  __resolveType(value: any) {
    return 'message' in value ? 'Error' : 'ConfessionArray';
  }

  @Query()
  @UseGuards(AuthGuard)
  getUserConfessions(@Context() context: any) {
    return this.userService.getUserConfessions(context);
  }
}
