import { getAuthCredentials, setAuthCredentials } from '@utils/auth-utils';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const apiClientImpersonation = axios.create({
  baseURL: `https://sandboxapi.ordercloud.io`,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClientImpersonation.interceptors.request.use(
  (config) => {
    const impersonationToken = Cookies.get('impersonationToken');
    const { token, internalToken } = getAuthCredentials();
    config.headers = {
      ...config.headers,
      ...(impersonationToken
        ? { Authorization: `Bearer ${impersonationToken}` }
        : token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(internalToken ? { 'Internal-Token': internalToken } : {}),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to fetch the me token
export const getMeToken = async (username:any, password:any) => {
  try {
    const response = await apiClientImpersonation.post(
      '/oauth/token',
      new URLSearchParams({
        client_id: `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT_CLIENT_ID}`,
        grant_type: 'password',
        username,
        password,
        scope: 'BundleReader BuyerAdmin BuyerImpersonation BuyerReader BuyerUserAdmin BuyerUserReader CatalogAdmin CatalogReader CategoryAdmin OrderAdmin Shopper UnsubmittedOrderReader',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    const { access_token } = response.data;
    Cookies.set('impersonationToken',access_token);

    // Store token securely
    const permissions = response.data.permissions || [];
    const internalToken = response.data.internalToken || '';
    // setAuthCredentials(access_token, permissions , internalToken);
    Cookies.set('impersonationMeta', JSON.stringify({ permissions, internalToken }));

    return access_token;
  } catch (error) {
    console.error('Failed to fetch token:', error);
    throw error;
  }
};


const username = 'David';
const password = 'Password1234!';

getMeToken(username, password)
  .then((token) => {
    Cookies.set('impersonationToken', token);
  })
  .catch((error) => {
    console.error('Failed to fetch token:', error.response?.data || error);
  });

  export const refreshTokenIfNeeded = async () => {
    const token = Cookies.get('impersonationToken');
    if (!token || isTokenExpired(token)) {
      const username = 'David';
      const password = 'Password1234!';
      const newToken = await getMeToken(username, password);
      return newToken;
    }
    return token;
  };
  
  const isTokenExpired = (token:any) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  };

export default apiClientImpersonation;

export const useImpersonationToken = (username: string, password: string) => {
  const [impersonationToken, setImpersonationToken] = useState<string | null>(null);
  const [isTokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    getMeToken(username, password)
      .then((newToken) => {
        console.log('Token fetched successfully:', newToken);
        setImpersonationToken(newToken);
        setTokenReady(true);
        apiClientImpersonation.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      })
      .catch((error) => {
        console.error('Failed to fetch token:', error.response?.data || error);
        setTokenReady(false);
      });
  }, [username, password]);

  return { impersonationToken, isTokenReady };
};
