import * as crypto from 'node:crypto';
import { z } from 'zod';

import { PrismaService } from 'src/infra/database/prisma.service';

export abstract class OAuthService {
  abstract readonly OAUTH_CLIENT_ID: string;
  abstract readonly OAUTH_CLIENT_SECRET: string;
  abstract readonly OAUTH_REDIRECT_URI: string;
  abstract readonly OAUTH_SCOPES: string[];
  abstract readonly OAUTH_URLs: { auth: string; token: string; user: string };

  protected readonly OAUTH_TOKEN_SCHEMA = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });

  constructor(protected readonly prismaService: PrismaService) {}

  createAuthUrl() {
    const baseUrl = new URL(this.OAUTH_URLs.auth);
    const { codeVerifier } = this.createCodeVerifier();
    const { state } = this.createState();

    baseUrl.searchParams.set('client_id', this.OAUTH_CLIENT_ID);
    baseUrl.searchParams.set('redirect_uri', this.OAUTH_REDIRECT_URI);
    baseUrl.searchParams.set('response_type', 'code');
    baseUrl.searchParams.set('scope', this.OAUTH_SCOPES.join(' '));
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

  protected async fetchToken(code: string, codeVerifier: string) {
    return fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
        client_id: this.OAUTH_CLIENT_ID,
        client_secret: this.OAUTH_CLIENT_SECRET,
        code_verifier: codeVerifier,
      }),
    })
      .then((res) => res.json())
      .then((rawData) => {
        const { data, success } = this.OAUTH_TOKEN_SCHEMA.safeParse(rawData);

        if (!success) throw new Error('Invalid token response');

        return {
          accessToken: data.access_token,
          tokenType: data.token_type,
          // expiresIn: data.expires_in,
          // scope: data.scope,
          // refreshToken: data.refresh_token,
        };
      });
  }

  private createCodeVerifier() {
    const codeVerifier = crypto.randomBytes(64).toString('hex').normalize();

    return { codeVerifier };
  }

  private createState() {
    const state = crypto.randomBytes(64).toString('hex').normalize();

    return { state };
  }
}
