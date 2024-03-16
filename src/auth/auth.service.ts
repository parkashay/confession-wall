import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthResponse,
  LoginCredentialsInput,
  RegisterCredentialsInput,
} from 'src/graphql';
import { validateEmail } from 'src/utils/email-validation';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  currentUser(context: any): AuthResponse {
    try {
      const user = context.req.user;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (err) {
      return { message: (err as Error).message };
    }
  }

  /**
   *
   * @param context
   * @param user
   * @returns User or Error Union Type
   */
  async registerWithCreds(
    context: any,
    user: RegisterCredentialsInput,
  ): Promise<AuthResponse> {
    try {
      // check if any field is missing
      if (Object.values(user).some((val) => !val))
        throw new Error('One or more fields are missing');
      if (!validateEmail(user.email)) throw new Error('Invalid Email');

      // check if email already exists
      const userExists = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (userExists) throw new Error('User already exists!');

      // hash the password
      const hashedPassword = await hash(user.password, 7);
      // create the user
      const createdUser = await this.userRepository.save({
        name: user.fullname,
        email: user.email,
        password: hashedPassword,
      });

      // make the payload ready for the jwt access token
      const payload = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      };
      const accessToken = await this.jwtService.signAsync(payload);

      // to send the cookie to the browser. Don't know if this is the actual way to do this lol
      context.res.cookie('_token_conf_gg', accessToken, {
        sameSite: 'lax',
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
      return { id: payload.id, name: payload.name, email: payload.email };
    } catch (err) {
      return { message: (err as Error).message };
    }
  }

  /**
   *
   * @param context
   * @param user
   * @returns User or Error Union Type
   */
  async loginWithCreds(
    context: any,
    user: LoginCredentialsInput,
  ): Promise<AuthResponse> {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!userExists) throw new UnauthorizedException('Invalid Credentials');
      const isAuthenticated = await compare(user.password, userExists.password);

      if (!isAuthenticated)
        throw new UnauthorizedException('Invalid Credentials');

      const payload = {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      context.res.cookie('_token_conf_gg', accessToken, {
        sameSite: 'lax',
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
      return payload;
    } catch (err) {
      return { message: (err as Error).message };
    }
  }

  async loginWithGoogle(context: any, token: string): Promise<AuthResponse> {
    // decode token
    try {
      const userInfo = await this.jwtService.decode(token);
      const { name, email, sub: password } = userInfo;
      console.log(userInfo);
      let accessToken: string;
      // check if user already exists with that email
      const userExixts = await this.userRepository.findOne({
        where: { email },
      });
      // create new user if no user with that email is on the database
      if (userExixts) {
        // update the name if the name doesn't match
        if (name !== userExixts.name) {
          await this.userRepository.update({ id: userExixts.id }, { name });
        }
        const payload = {
          id: userExixts.id,
          name: userExixts.name,
          email: userExixts.email,
        };
        accessToken = await this.jwtService.signAsync(payload);
      } else {
        const createdUser = await this.userRepository.save({
          email,
          name,
          password,
        });
        const payload = {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        };
        accessToken = await this.jwtService.signAsync(payload);
      }

      // set the accessToken to the cookie and send the response to the client
      context.res.cookie('_token_conf_gg', accessToken, {
        samesite: 'lax',
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
      return userExixts;
    } catch (error) {
      return { message: (error as Error).message };
    }
  }
}
