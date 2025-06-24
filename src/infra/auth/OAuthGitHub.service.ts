import * as crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { EnvService } from '../env/env.service';

@Injectable()
export class OAuthGitHubService {
  private readonly AUTH_URL = 'https://github.com/login/oauth/authorize';
  private readonly TOKEN_URL = 'https://github.com/login/oauth/access_token';
  private readonly USER_URL = 'https://api.github.com/user';
  private readonly EMAIL_URL = 'https://api.github.com/user/emails';

  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });

  private readonly userSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    login: z.string(),
    email: z.string().email().nullable(),
  });

  private readonly userEmailSchema = z.array(
    z.object({
      email: z.string().email(),
      primary: z.boolean(),
      verified: z.boolean(),
    }),
  );

  constructor(private readonly envService: EnvService) {}

  createAuthUrl() {
    const baseUrl = new URL(this.AUTH_URL);
    const { codeVerifier } = this.createCodeVerifier();
    const { state } = this.createState();

    baseUrl.searchParams.set(
      'client_id',
      this.envService.get('GITHUB_CLIENT_ID'),
    );
    baseUrl.searchParams.set(
      'redirect_uri',
      this.envService.get('GITHUB_REDIRECT_URI'),
    );
    baseUrl.searchParams.set('response_type', 'code');
    baseUrl.searchParams.set('scope', 'read:user user:email');
    baseUrl.searchParams.set('state', state);
    baseUrl.searchParams.set('code_challenge_method', 'S256');
    baseUrl.searchParams.set(
      'code_challenge',
      crypto.hash('sha256', codeVerifier, 'base64url'),
    );

    return {
      url: baseUrl.toString(),
      codeVerifier,
      state,
    };
  }

  async fetchUser(
    code: string,
    state: string,
    cookieState: string,
    codeVerifier: string,
  ) {
    const isValidState = state === cookieState;

    if (!isValidState) {
      throw new Error('Invalid state parameter');
    }

    const { accessToken, tokenType } = await this.fetchToken(
      code,
      codeVerifier,
    );

    const user = await fetch(this.USER_URL, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((rawData) => {
        const { data, success, error } = this.userSchema.safeParse(rawData);

        if (!success) {
          console.error('Invalid user response:', error);
          throw new Error('Invalid user response');
        }

        return {
          id: data.id,
          username: data.login,
          globalName: data.name ?? data.login,
          email: data.email,
        };
      });

    if (!user.email) {
      await fetch(this.EMAIL_URL, {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((rawData) => {
          const { data, success, error } =
            this.userEmailSchema.safeParse(rawData);

          if (!success) {
            console.error('Invalid user response:', error);
            throw new Error('Invalid user response');
          }

          const userEmail = data.find(({ primary }) => primary);

          if (userEmail) {
            user.email = userEmail.email;
          }
        });
    }

    return {
      accessToken,
      tokenType,
      user,
    };
  }

  private async fetchToken(code: string, codeVerifier: string) {
    return fetch(this.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.envService.get('GITHUB_REDIRECT_URI').toString(),
        grant_type: 'authorization_code',
        client_id: this.envService.get('GITHUB_CLIENT_ID'),
        client_secret: this.envService.get('GITHUB_CLIENT_SECRET'),
        code_verifier: codeVerifier,
      }),
    })
      .then((res) => res.json())
      .then((rawData) => {
        console.log('Raw token response:', rawData);
        const { data, success } = this.tokenSchema.safeParse(rawData);

        if (!success) throw new Error('Invalid token response');

        return {
          accessToken: data.access_token,
          tokenType: data.token_type,
        };
      });
  }

  private createCodeVerifier() {
    const codeVerifier = crypto.randomBytes(64).toString('hex').normalize();

    return {
      codeVerifier,
    };
  }

  private createState() {
    const state = crypto.randomBytes(64).toString('hex').normalize();

    return {
      state,
    };
  }
}
