import { Auth } from 'ordercloud-javascript-sdk';
import { AuthResponse, LoginDto } from '@packages/commerce/dist/auth';
import { ADMIN_SCOPE, ANONYMOUS_SCOPE, CLIENT_SCOPE } from '../settings';
import { getScope } from '../utils/helpers';

const adminLogin = async (loginInput: LoginDto): Promise<AuthResponse> => {
  try {
    const response = await Auth.Login(
      loginInput.email,
      loginInput.password,
      process?.env?.ORDERCLOUD_SELLER_CLIENT_ID,
      ADMIN_SCOPE,
    );
    const permissions = getScope(response.access_token);
    return {
      internalToken: response.access_token,
      token: response.access_token,
      permissions,
    };
  } catch (err) {
    console.error('Admin login error', err);
  }
};

const clientLogin = async (loginInput: LoginDto): Promise<AuthResponse> => {
  try {
    const response = await Auth.Login(
      loginInput.email,
      loginInput.password,
      process?.env?.ORDERCLOUD_BUYER_CLIENT_ID,
      CLIENT_SCOPE,
    );
    const permissions = getScope(response.access_token);
    return {
      internalToken: response.access_token,
      token: response.access_token,
      permissions,
    };
  } catch (err) {
    console.error('Client login error', err);
  }
};

const anonymousLogin = async (): Promise<AuthResponse> => {
  try {
    const response = await Auth.ClientCredentials(
      process?.env?.ORDERCLOUD_MIDDLEWARE_CLIENT_SECRET,
      process?.env?.ORDERCLOUD_BUYER_CLIENT_ID,
      ANONYMOUS_SCOPE,
    );
    const permissions = getScope(response.access_token);
    return {
      internalToken: response.access_token,
      token: response.access_token,
      permissions,
    };
  } catch (err) {
    console.error('Anonymous login error', err);
  }
};

export default {
  adminLogin,
  clientLogin,
  anonymousLogin,
};
