import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RefreshTokenDto } from '../dto';
import { ResponseUtil } from 'src/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthenticatedUser } from '../interfaces/user.interface';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return ResponseUtil.success(result, 'Login successful');
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );
    return ResponseUtil.success(result, 'Token refreshed successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return ResponseUtil.success(null, 'Logout successful');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return ResponseUtil.success(user, 'Profile retrieved successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke-all-tokens')
  async revokeAllTokens(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.revokeAllUserTokens(user.id);
    return ResponseUtil.success(null, 'All tokens revoked successfully');
  }
}
