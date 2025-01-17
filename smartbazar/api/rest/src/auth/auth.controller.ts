import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  OtpDto,
  OtpLoginDto,
  RegisterDto,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyForgetPasswordDto,
  VerifyOtpDto,
} from '@packages/commerce/dist/auth/dto/create-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createAccount(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('admin-token')
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, true);
  }
  @Post('token')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('social-login-token')
  socialLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.authService.socialLogin(socialLoginDto);
  }
  @Post('otp-login')
  otpLogin(@Body() otpLoginDto: OtpLoginDto) {
    return this.authService.otpLogin(otpLoginDto);
  }
  @Post('send-otp-code')
  sendOtpCode(@Body() otpDto: OtpDto) {
    return this.authService.sendOtpCode(otpDto);
  }
  @Post('verify-otp-code')
  verifyOtpCode(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtpCode(verifyOtpDto);
  }
  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
  @Post('logout')
  async logout(): Promise<boolean> {
    return true;
  }
  @Post('verify-forget-password-token')
  verifyForgetPassword(
    @Body() verifyForgetPasswordDto: VerifyForgetPasswordDto,
  ) {
    return this.authService.verifyForgetPasswordToken(verifyForgetPasswordDto);
  }

  @Get('me')
  async me(@Headers() headers) {
    return this.authService.me(headers);
  }
  @Post('add-points')
  async addWalletPoints(@Headers() headers, @Body() addPointsDto: any) {
    return this.authService.me(headers);
  }
  @Post('add-to-cart')
  async addToCart(@Headers() headers, @Body() addLineItemDto: any) {
    return this.authService.me(headers);
  }
  @Post('contact-us')
  contactUs(@Body() addPointsDto: any) {
    return {
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
    };
  }
}
