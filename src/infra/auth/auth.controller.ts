import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OAuthService } from './auth.service';

const STATE_COOKIE_KEY = 'oauth_state';
const CODE_VERIFIER_COOKIE_KEY = 'oauth_code_verifier';

@Controller('auth')
export class AuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get()
  redirectToOAuth(@Res() res: Response) {
    const {
      url,
      cookieOptionsState,
      state,
      cookieOptionsVerifies,
      codeVerifier,
    } = this.oauthService.createAuthUrl();

    res.cookie(STATE_COOKIE_KEY, state, cookieOptionsState);
    res.cookie(CODE_VERIFIER_COOKIE_KEY, codeVerifier, cookieOptionsVerifies);
    return res.redirect(url);
  }

  @Get('discord/callback')
  async discordOAuth(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // const provider = 'discord';

    // if (!code || !state) { middleware
    //   res.redirect('')

    // passe um param para rota com a mensagem de erro
    // }

    console.log('verifier:', req.cookies[CODE_VERIFIER_COOKIE_KEY]);

    const OAuthUser = await this.oauthService.fetchUser(
      code,
      state,
      (req.cookies[STATE_COOKIE_KEY] as string) ?? '',
      (req.cookies[CODE_VERIFIER_COOKIE_KEY] as string) ?? '',
    );

    console.log('User data:', OAuthUser);

    return res.send();
  }
}
