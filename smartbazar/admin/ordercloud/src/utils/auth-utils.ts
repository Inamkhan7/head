import Cookie from 'js-cookie';
import SSRCookie from 'cookie';
import jwt_decode from 'jwt-decode';
import {
  AUTH_CRED,
  PERMISSIONS,
  STAFF,
  STORE_OWNER,
  SUPER_ADMIN,
  TOKEN,
} from './constants';

export const allowedRoles = [SUPER_ADMIN, STORE_OWNER, STAFF];
export const adminAndOwnerOnly = [SUPER_ADMIN, STORE_OWNER];
export const adminOwnerAndStaffOnly = [SUPER_ADMIN, STORE_OWNER, STAFF];
export const adminOnly = [SUPER_ADMIN];
export const ownerOnly = [STORE_OWNER];

export function setAuthCredentials(
  token: string,
  permissions: string[],
  internalToken: string
) {
  Cookie.set(AUTH_CRED, JSON.stringify({ token, permissions, internalToken }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
  internalToken: string | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }
  if (authCred) {
    return JSON.parse(authCred);
  }
  return { token: null, permissions: null, internalToken: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? '');
}

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string[] | undefined | null
) {
  if (_userPermissions) {
    return Boolean(
      _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    );
  }
  return false;
}
export function isAuthenticated(_cookies: any) {
  const isTokenValid =
    !!_cookies[TOKEN] &&
    Date.now() < jwt_decode<{ exp: number }>(_cookies[TOKEN]).exp * 1000;
  const hasPermissions =
    Array.isArray(_cookies[PERMISSIONS]) && !!_cookies[PERMISSIONS].length;
  const isAuthValid = isTokenValid && hasPermissions;

  if (!isTokenValid) {
    Cookie.remove(AUTH_CRED);
  }

  return isAuthValid;
}
