import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  AuthResponse,
  LoginCredentialsInput,
  RegisterCredentialsInput,
} from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Resolver('AuthResponse')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @ResolveField()
  __resolveType(value: AuthResponse) {
    return 'message' in value ? 'Error' : 'User';
  }

  @Query()
  @UseGuards(AuthGuard)
  currentUser(@Context() context: GraphQLExecutionContext) {
    return this.authService.currentUser(context);
  }

  @Mutation()
  loginWithGoogle(
    @Context() context: GraphQLExecutionContext,
    @Args('token') token: string,
  ) {
    return this.authService.loginWithGoogle(context, token);
  }

  @Mutation()
  registerWithCredentials(
    @Context() context: GraphQLExecutionContext,
    @Args('input') input: RegisterCredentialsInput,
  ): Promise<AuthResponse> {
    return this.authService.registerWithCreds(context, input);
  }

  @Mutation()
  loginWithCredentials(
    @Context() context: GraphQLExecutionContext,
    @Args('input') input: LoginCredentialsInput,
  ): Promise<AuthResponse> {
    return this.authService.loginWithCreds(context, input);
  }
}
