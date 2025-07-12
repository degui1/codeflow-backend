import * as crypto from 'node:crypto';
import {
  Controller,
  ForbiddenException,
  Get,
  Param,
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
    const cookieOptions = this.cookieService.getSessionCookieOptions();

    res.cookie(STATE_COOKIE_KEY, state, cookieOptions);
    res.cookie(CODE_VERIFIER_COOKIE_KEY, codeVerifier, cookieOptions);

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

    const sessionToken = crypto.randomBytes(24).toString().normalize();

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
    res.cookie(SESSION_COOKIE_KEY, sessionToken);

    return res.redirect(CLIENT_URL);
  }

  @Get('github/callback')
  @Public()
  async githubOAuth(
    @Query('code') code: string,
    @Query('state') state: string,
    @Cookies(STATE_COOKIE_KEY) stateCookie: string,
    @Cookies(CODE_VERIFIER_COOKIE_KEY) codeVerifier: string,
    @Res() res: Response,
  ) {
    const { accessToken, tokenType, user } =
      await this.oauthGithubService.fetchUser(
        code,
        state,
        stateCookie,
        codeVerifier,
      );

    const sessionToken = crypto.randomBytes(24).toString().normalize();

    await this.authUseCase.execute({
      accessToken,
      tokenType,
      sessionToken,
      email: user.email!, // todo - remove "!"
      name: user.globalName ?? user.username,
      oauthUserId: user.id.toString(),
      provider: 'DISCORD',
      username: user.username,
    });

    const CLIENT_URL = this.envService.get('CLIENT_BASE_URL');
    res.cookie(SESSION_COOKIE_KEY, sessionToken);

    return res.redirect(CLIENT_URL);
  }
}
