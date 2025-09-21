import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from 'src/infra/app.module';
import { DatabaseModule } from 'src/infra/database/database.module';

describe('Community controller (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[GET] /community', async () => {
    const response = await request(app.getHttpServer()).get('/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
