import { Injectable } from '@nestjs/common';
import { env } from 'src/core/utils/env';
import { z } from 'zod';
import { PrismaService } from '../database/prisma.service';
import * as crypto from 'node:crypto';

@Injectable()
export class OAuthService {
  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
    // expires_in: z.number(),
    // scope: z.string(),
    // refresh_token: z.string().optional(),
    // error: z.string().optional(),
    // error_description: z.string().optional(),
  });

  private readonly userSchema = z.object({
    id: z.string(),
    username: z.string(),
    global_name: z.string().nullable(),
    email: z.string().email(),
  });

  constructor(private readonly prismaService: PrismaService) {}

  createAuthUrl() {
    const baseUrl = new URL('https://discord.com/oauth2/authorize');
    const { codeVerifier } = this.createCodeVerifier();
    const { state } = this.createState();

    baseUrl.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
    baseUrl.searchParams.set('redirect_uri', env.DISCORD_REDIRECT_URI);
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

    const user = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((rawData) => {
        console.log('Raw user response:', rawData);
        const { data, success, error } = this.userSchema.safeParse(rawData);

        if (!success) {
          console.error('Invalid user response:', error);
          throw new Error('Invalid user response');
        }

        return {
          id: data.id,
          username: data.username,
          globalName: data.global_name,
          email: data.email,
        };
      });

    await this.prismaService.$transaction(async (prisma) => {
      let userRecord = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!userRecord) {
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            username: user.username,
            name: user.globalName ?? user.username,
          },
        });

        userRecord = newUser;
      }

      await prisma.account.create({
        data: {
          user_id: userRecord.id,
          provider: 'DISCORD',
          provider_account_id: user.id,
          access_token: accessToken,
          token_type: tokenType,
          type: 'oauth',

          // refreshToken: data.refresh_token, // Uncomment if you want to store refresh tokens
        },
      });

      await prisma.session.create({
        data: {
          user_id: userRecord.id,
          expires: new Date(Date.now() + 60 * 60 * 1000), // Set session expiration to 1 hour
          session_token: 'session-token', // Generate a session token if needed - encrypt or hash it
        },
      });
    });

    return {
      id: user.id,
      username: user.globalName ?? user.username,
      email: user.email,
    };
  }

  private async fetchToken(code: string, codeVerifier: string) {
    return fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: env.DISCORD_REDIRECT_URI.toString(),
        grant_type: 'authorization_code',
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
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
          // expiresIn: data.expires_in,
          // scope: data.scope,
          // refreshToken: data.refresh_token,
        };
      });
  }

  createCodeVerifier() {
    const codeVerifier = crypto.randomBytes(64).toString('hex').normalize();

    return {
      codeVerifier,
    };
  }

  createState() {
    const state = crypto.randomBytes(64).toString('hex').normalize();

    return {
      state,
    };
  }
}
