import { Injectable } from '@nestjs/common';
import {
  AuthResponse,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  CoreResponse,
  RegisterDto,
  ResetPasswordDto,
  VerifyForgetPasswordDto,
  SocialLoginDto,
  OtpLoginDto,
  OtpResponse,
  VerifyOtpDto,
  OtpDto,
} from '@packages/commerce/dist/auth/dto/create-auth.dto';
import { User } from '@packages/commerce/dist/users/entities/user.entity';
import CommerceProvider from '../providers';

@Injectable()
export class AuthService {
  async register(createUserInput: RegisterDto): Promise<AuthResponse> {
    const _provider = await CommerceProvider.getProvider();
    const userInput = await _provider.AdminUsers.createAdminUser(
      createUserInput,
    );
    return {
      token: 'jwt token',
      internalToken: 'internal token',
      permissions: userInput.AvailableRoles,
    };
  }

  async login(loginInput: LoginDto, isAdmin?: boolean): Promise<AuthResponse> {
    const _provider = await CommerceProvider.getProvider();
    const loginMethod = isAdmin
      ? _provider.Auth.adminLogin
      : _provider.Auth.clientLogin;

    const response = await loginMethod(loginInput);
    return response;
  }

  async changePassword(
    changePasswordInput: ChangePasswordDto,
  ): Promise<CoreResponse> {
    console.log(changePasswordInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async forgetPassword(
    forgetPasswordInput: ForgetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(forgetPasswordInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(verifyForgetPasswordTokenInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(resetPasswordInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async socialLogin(socialLoginDto: SocialLoginDto): Promise<AuthResponse> {
    console.log(socialLoginDto);
    return {
      token: 'jwt token',
      internalToken: 'internal token',
      permissions: ['super_admin', 'customer'],
    };
  }

  async otpLogin(otpLoginDto: OtpLoginDto): Promise<AuthResponse> {
    console.log(otpLoginDto);
    return {
      token: 'jwt token',
      internalToken: 'internal token',
      permissions: ['super_admin', 'customer'],
    };
  }

  async verifyOtpCode(verifyOtpInput: VerifyOtpDto): Promise<CoreResponse> {
    console.log(verifyOtpInput);
    return {
      message: 'success',
      success: true,
    };
  }

  async sendOtpCode(otpInput: OtpDto): Promise<OtpResponse> {
    console.log(otpInput);
    return {
      message: 'success',
      success: true,
      id: '1',
      provider: 'google',
      phone_number: '+919494949494',
      is_contact_exist: true,
    };
  }

  async me(headers: any): Promise<User> {
    const _provider = await CommerceProvider.getProvider();
    _provider.helpers.checkToken(headers);
    const user = await _provider.Me.getUser();
    return user;
  }

  // updateUser(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }
}
