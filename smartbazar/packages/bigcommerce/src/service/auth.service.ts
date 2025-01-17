import { AuthResponse, LoginDto } from '@packages/commerce/dist/auth';

const adminLogin = async (loginInput: LoginDto): Promise<AuthResponse> => null;

const clientLogin = async (loginInput: LoginDto): Promise<AuthResponse> => null;

const anonymousLogin = async (): Promise<AuthResponse> => null;

export default {
  adminLogin,
  clientLogin,
  anonymousLogin,
};
