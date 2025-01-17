import jwt_decode from 'jwt-decode';
import { Tokens } from 'ordercloud-javascript-sdk';
import AuthService from '../service/auth.service';

export const getScope = (token?: string): string[] => {
  if (token) {
    const tokenData: { role: string[] | string } = token
      ? jwt_decode(token)
      : null;

    if (tokenData) {
      return typeof tokenData.role === 'string'
        ? [tokenData.role as string]
        : (tokenData.role as string[]);
    }

    return [];
  }
  return [];
};

export const checkToken = async (
  headers,
  scope?: string[],
  fallbackAnonymous?: boolean,
) => {
  const token = headers?.authorization?.split(' ')[1];
  const isScopeValid = scope
    ? getScope(token).join(',') === scope.join(',')
    : true;

  if (token && isScopeValid) {
    Tokens.SetAccessToken(token);
    return;
  }

  if (fallbackAnonymous && (!token || isScopeValid)) {
    const credentials = await AuthService.anonymousLogin();
    Tokens.SetAccessToken(credentials.token);
    return;
  }

  throw Error('Access token is missing from request headers');
};

export const setToken = async (headers, fallbackAnonymous?: boolean) => {
  const token = headers?.authorization?.split(' ')[1];

  if (token) {
    Tokens.SetAccessToken(token);
    return;
  }

  if (fallbackAnonymous && !token) {
    const credentials = await AuthService.anonymousLogin();
    Tokens.SetAccessToken(credentials.token);
    return;
  }
};
