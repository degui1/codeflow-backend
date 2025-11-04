import * as crypto from 'node:crypto';
import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CookieService } from 'src/infra/auth/cookie.service';
import { Cookies } from '../decorators/cookies.decorator';
import { AuthUseCase } from 'src/domain/use-cases/auth/auth.use-case';
import { OAuthDiscordService } from 'src/infra/auth/oauth-discord.service';
import { OAuthGitHubService } from 'src/infra/auth/oauth-github.service';
import { Public } from '../decorators/public.decorator';
import { EnvService } from 'src/infra/env/env.service';
import { LogoutUseCase } from 'src/domain/use-cases/auth/logout.use-case';
import { UserId } from '../decorators/user.decorator';
import { IsSessionValidUseCase } from 'src/domain/use-cases/auth/is-session-valid.use-case';

const SESSION_COOKIE_KEY = 'session_cookie';
const STATE_COOKIE_KEY = 'oauth_state';
const CODE_VERIFIER_COOKIE_KEY = 'oauth_code_verifier';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly oauthDiscordService: OAuthDiscordService,
    private readonly oauthGithubService: OAuthGitHubService,
    private readonly authUseCase: AuthUseCase,
    private readonly cookieService: CookieService,
    private readonly envService: EnvService,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly isSessionValidUseCase: IsSessionValidUseCase,
  ) {}

  private getOAuthService(provider: string) {
    switch (provider) {
      case 'discord':
        return this.oauthDiscordService;
      case 'github':
        return this.oauthGithubService;
      default:
        throw new ForbiddenException('Invalid OAuth provider');
    }
  }

  @Get(':provider')
  @Public()
  redirectToOAuth(@Res() res: Response, @Param('provider') provider: string) {
    const oauthService = this.getOAuthService(provider);
    const { url, state, codeVerifier } = oauthService.createAuthUrl();
    const oAuthCookieOptions = this.cookieService.getOAuthCookieOptions();

    res.cookie(STATE_COOKIE_KEY, state, oAuthCookieOptions);
    res.cookie(CODE_VERIFIER_COOKIE_KEY, codeVerifier, oAuthCookieOptions);

    return res.redirect(url);
  }

  @Get(':provider/callback')
  @Public()
  async discordOAuth(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Cookies(STATE_COOKIE_KEY) stateCookie: string,
    @Cookies(CODE_VERIFIER_COOKIE_KEY) codeVerifier: string,
    @Res() res: Response,
  ) {
    const oauthService = this.getOAuthService(provider);
    const { accessToken, tokenType, user } = await oauthService.fetchUser(
      code,
      state,
      stateCookie,
      codeVerifier,
    );

    const sessionToken = crypto.randomUUID();
    const cookieOptions = this.cookieService.getOAuthCookieOptions();

    await this.authUseCase.execute({
      accessToken,
      tokenType,
      sessionToken,
      email: user.email!,
      name: user.globalName ?? user.username,
      oauthUserId: String(user.id),
      provider: oauthService.PROVIDER,
      username: user.username,
      image: user.image,
    });

    const CLIENT_URL = this.envService.get('CLIENT_BASE_URL');
    res.cookie(SESSION_COOKIE_KEY, sessionToken, cookieOptions);

    return res.redirect(CLIENT_URL);
  }

  @Delete('logout')
  async logout(
    @UserId() userId: string,
    @Res() resp: Response,
    @Res() res: Response,
  ) {
    await this.logoutUseCase.execute({ userId });

    resp.clearCookie(SESSION_COOKIE_KEY);

    const CLIENT_URL = this.envService.get('CLIENT_BASE_URL');

    return res.redirect(CLIENT_URL);
  }

  @Post('session-verify')
  @Public()
  async getIsAuthenticated(@Cookies(SESSION_COOKIE_KEY) sessionToken: string) {
    if (!sessionToken) {
      return { isAuthenticated: false };
    }

    const { isAuthenticated } = await this.isSessionValidUseCase.execute({
      sessionToken,
    });

    return {
      isAuthenticated,
    };
  }
}
