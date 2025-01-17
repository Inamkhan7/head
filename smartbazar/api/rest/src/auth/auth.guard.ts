import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import CommerceProvider from '../providers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflactor: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextHandler = context.getHandler();
    const provider = await CommerceProvider.getProvider();
    const allowAnonymous = this.reflactor.get<boolean>(
      'allow-anonymous',
      contextHandler,
    );
    const request = context.switchToHttp().getRequest();
    await provider.helpers.setToken(request.headers, allowAnonymous);
    return Promise.resolve(true);
  }
}
