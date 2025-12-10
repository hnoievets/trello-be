import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'sequelize-typescript';
import { User } from '../src/users/entities';
import { SessionDto } from '../src/sessions/dto';
import { getModelToken } from '@nestjs/sequelize';
import { randomUUID } from 'node:crypto';

describe('CommentsController (e2e)', () => {
  let app: INestApplication;
  let userModel: Repository<User>;

  const firstName = 'firstName';
  const lastName = 'lastName';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userModel = app.get(getModelToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 422 if user does not exist', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'not_exists@example.com',
      password: '123456',
      lifeTime: 100,
    });

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should return 422 for wrong password', async () => {
    const email = randomUUID() + '@example.com';
    const password = '123456';

    await userModel.create({
      firstName,
      lastName,
      email,
      password,
      isVerified: true,
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password: 'incorrect',
      lifeTime: 100,
    });

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should return 400 if user not verified', async () => {
    const email = randomUUID() + '@example.com';
    const password = '123456';

    await userModel.create({
      lastName,
      firstName,
      email,
      password,
      isVerified: false,
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password,
      lifeTime: 100,
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should create session and return session dto', async () => {
    const email = randomUUID() + 'verified@example.com';
    const password = '123456';

    await userModel.create({
      firstName,
      lastName,
      email,
      password,
      isVerified: true,
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password,
      lifeTime: 100,
    });

    const body: SessionDto = response.body;

    expect(response.status).toBe(HttpStatus.CREATED);

    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
    expect(body.expiresAt).toBeDefined();
  });
});
