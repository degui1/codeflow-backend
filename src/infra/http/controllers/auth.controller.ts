import { Controller, Get, Query, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OAuthService } from '../../auth/auth.service';
import { CookieService } from 'src/infra/auth/cookie.service';
import { Cookies } from '../decorators/cookies.decorator';

const STATE_COOKIE_KEY = 'oauth_state';
const CODE_VERIFIER_COOKIE_KEY = 'oauth_code_verifier';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Get()
  redirectToOAuth(@Res() res: Response) {
    const { url, state, codeVerifier } = this.oauthService.createAuthUrl();
    const cookieOptions = this.cookieService.getSessionCookieOptions();

    res.cookie(STATE_COOKIE_KEY, state, cookieOptions);
    res.cookie(CODE_VERIFIER_COOKIE_KEY, codeVerifier, cookieOptions);

    return res.redirect(url);
  }

  @Get('discord/callback')
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

    const OAuthUser = await this.oauthService.fetchUser(
      code,
      state,
      stateCookie,
      codeVerifier,
    );

    console.log('User data:', OAuthUser);

    return res.send();
  }
}
