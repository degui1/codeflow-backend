import * as crypto from 'node:crypto';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CookieService } from 'src/infra/auth/cookie.service';
import { Cookies } from '../decorators/cookies.decorator';
import { AuthUseCase } from 'src/domain/use-cases/auth.use-case';
import { OAuthDiscordService } from 'src/infra/auth/OAuthDiscord.service';
import { OAuthGitHubService } from 'src/infra/auth/OAuthGitHub.service';
import { Public } from '../decorators/public.decorator';

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
  ) {}

  @Get('discord')
  @Public()
  redirectToOAuth(@Res() res: Response) {
    const { url, state, codeVerifier } =
      this.oauthDiscordService.createAuthUrl();
    const cookieOptions = this.cookieService.getSessionCookieOptions();

    res.cookie(STATE_COOKIE_KEY, state, cookieOptions);
    res.cookie(CODE_VERIFIER_COOKIE_KEY, codeVerifier, cookieOptions);

    return res.redirect(url);
  }

  @Get('github')
  @Public()
  redirectToOAuthGithub(@Res() res: Response) {
    const { url, state, codeVerifier } =
      this.oauthGithubService.createAuthUrl();
    const cookieOptions = this.cookieService.getSessionCookieOptions();

    res.cookie(STATE_COOKIE_KEY, state, cookieOptions);
    res.cookie(CODE_VERIFIER_COOKIE_KEY, codeVerifier, cookieOptions);

    return res.redirect(url);
  }

  @Get('discord/callback')
  @Public()
  async discordOAuth(
    @Query('code') code: string,
    @Query('state') state: string,
    @Cookies(STATE_COOKIE_KEY) stateCookie: string,
    @Cookies(CODE_VERIFIER_COOKIE_KEY) codeVerifier: string,
    @Res() res: Response,
  ) {
    // const provider = 'discord';

    // if (!code || !state) { middleware
    //   res.redirect('')

    // passe um param para rota com a mensagem de erro
    // }

    const { accessToken, tokenType, user } =
      await this.oauthDiscordService.fetchUser(
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
      email: user.email,
      name: user.globalName ?? user.username,
      oauthUserId: user.id,
      provider: 'DISCORD',
      username: user.username,
    });

    res.cookie(
      SESSION_COOKIE_KEY,
      this.cookieService.getSessionCookieOptions(),
    );

    return res.send();
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

    res.cookie(
      SESSION_COOKIE_KEY,
      this.cookieService.getSessionCookieOptions(),
    );

    return res.send();
  }
}
