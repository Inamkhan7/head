import axios from 'axios';
import { AuthResponse, LoginDto } from '@packages/commerce/dist/auth';
import { getEnv } from '../utils/env';
import { createToken, getScope } from '../utils/helpers';
import { TokenDataType } from '../types';

const login = async (loginInput: LoginDto): Promise<AuthResponse> => {
  delete axios.defaults.headers.common['authorization'];
  const response = await axios.post<TokenDataType>(
    `${getEnv('COMMERCETOOLS_AUTH_URL')}/oauth/${getEnv(
      'COMMERCETOOLS_PROJECT_KEY',
    )}/customers/token?grant_type=password&username=${
      loginInput.email
    }&password=${loginInput.password}`,
    {},
    {
      auth: {
        password: getEnv('COMMERCETOOLS_CLIENT_SECRET'),
        username: getEnv('COMMERCETOOLS_CLIENT_ID'),
      },
    },
  );
  const access_token = createToken(response.data);
  const permissions = getScope(access_token);
  return {
    internalToken: access_token,
    token: response.data.access_token,
    permissions,
  };
};

const adminLogin = async (loginInput: LoginDto): Promise<AuthResponse> => {
  try {
    return await login(loginInput);
  } catch (err) {
    console.error('Admin login error', err);
  }
};

const clientLogin = async (loginInput: LoginDto): Promise<AuthResponse> => {
  try {
    return await login(loginInput);
  } catch (err) {
    console.error('Client login error', err);
  }
};

const anonymousLogin = async (): Promise<AuthResponse> => {
  try {
    return await login({ username: 'anonymous', password: 'anonymous' });
  } catch (err) {
    console.error('Anonymous login error', err);
  }
};

export default {
  adminLogin,
  clientLogin,
  anonymousLogin,
};
