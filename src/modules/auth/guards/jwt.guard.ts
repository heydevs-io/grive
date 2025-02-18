import { IS_PUBLIC_KEY } from '@decorators';
import { SourcingUnauthorizedException } from '@exceptions';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext): any {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any): any {
    if (info instanceof jwt.TokenExpiredError) {
      throw new SourcingUnauthorizedException('Token expired');
    }
    if (err || !user) {
      throw new SourcingUnauthorizedException(
        err?.message ?? 'Unauthorized user',
      );
    }

    return user;
  }
}
