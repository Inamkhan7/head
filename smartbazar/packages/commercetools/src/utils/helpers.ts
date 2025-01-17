import jwt_decode from 'jwt-decode';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import AuthService from '../service/auth.service';
import { TokenDataType } from '../types';
import { getEnv } from './env';

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
  const internalToken = headers?.['internal-token'];
  const isScopeValid = scope
    ? getScope(internalToken).join(',') === scope.join(',')
    : true;

  if (token && isScopeValid) {
    axios.defaults.headers.authorization = `Bearer ${token}`;
    return;
  }

  if (fallbackAnonymous && (!token || isScopeValid)) {
    const credentials = await AuthService.anonymousLogin();
    axios.defaults.headers.authorization = `Bearer ${credentials.token}`;
    return;
  }

  throw Error('Access token is missing from request headers');
};

export const setToken = async (headers, fallbackAnonymous?: boolean) => {
  const token = headers?.authorization?.split(' ')[1];

  if (token) {
    // Tokens.SetAccessToken(token);
    return;
  }

  if (fallbackAnonymous && !token) {
    const credentials = await AuthService.anonymousLogin();
    // Tokens.SetAccessToken(credentials.token);
    return;
  }
};

export const createToken = (data: TokenDataType): string => {
  const [_role, _customer] = data.scope.split(' ');
  const role = _role.startsWith('manage_project')
    ? ['FullAccess']
    : ['Shopper'];
  const cid = _customer.split(':')[1];
  return jwt.sign(
    { cid, role, ctat: data.access_token },
    getEnv('JWT_SECRET'),
    {
      expiresIn: data.expires_in,
    },
  );
};

export const getBaseUrl = () =>
  `${getEnv('COMMERCETOOLS_API_URL')}/${getEnv('COMMERCETOOLS_PROJECT_KEY')}`;
