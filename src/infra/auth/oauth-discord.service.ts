import * as crypto from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { z } from 'zod';
import { EnvService } from '../env/env.service';

@Injectable()
export class OAuthDiscordService {
  private readonly AUTH_URL = 'https://discord.com/oauth2/authorize';
  private readonly TOKEN_URL = 'https://discord.com/api/oauth2/token';
  private readonly USER_URL = 'https://discord.com/api/users/@me';
  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });

  private readonly userSchema = z.object({
    id: z.string(),
    username: z.string(),
    global_name: z.string().nullable(),
    email: z.string().email(),
  });

  constructor(private readonly envService: EnvService) {}

  createAuthUrl() {
    const baseUrl = new URL(this.AUTH_URL);
    const { codeVerifier } = this.createCodeVerifier();
    const { state } = this.createState();

    baseUrl.searchParams.set(
      'client_id',
      this.envService.get('DISCORD_CLIENT_ID'),
    );
    baseUrl.searchParams.set(
      'redirect_uri',
      this.envService.get('DISCORD_REDIRECT_URI'),
    );
    baseUrl.searchParams.set('response_type', 'code');
    baseUrl.searchParams.set('scope', 'identify email');
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
        const { data, success } = this.userSchema.safeParse(rawData);

        if (!success) {
          throw new UnauthorizedException(
            'Invalid user response from OAuth provider',
          );
        }

        return {
          id: data.id,
          username: data.username,
          globalName: data.global_name,
          email: data.email,
        };
      });

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
        redirect_uri: this.envService.get('DISCORD_REDIRECT_URI').toString(),
        grant_type: 'authorization_code',
        client_id: this.envService.get('DISCORD_CLIENT_ID'),
        client_secret: this.envService.get('DISCORD_CLIENT_SECRET'),
        code_verifier: codeVerifier,
      }),
    })
      .then((res) => res.json())
      .then((rawData) => {
        const { data, success } = this.tokenSchema.safeParse(rawData);

        if (!success) {
          throw new UnauthorizedException(
            'Invalid user response from OAuth provider',
          );
        }

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
